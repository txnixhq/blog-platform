import httpx
from fastapi import APIRouter, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from routes.supabase import sb_url, anon_headers, auth_headers, get_user, extract_token

router = APIRouter(prefix="/posts")


class PostBody(BaseModel):
    title: str
    content: str


@router.get("")
async def list_posts():
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{sb_url()}/rest/v1/posts?select=*&order=created_at.desc",
            headers=anon_headers(),
        )
    return {"data": resp.json(), "error": None}


@router.get("/{post_id}")
async def get_post(post_id: str):
    async with httpx.AsyncClient() as client:
        post_resp = await client.get(
            f"{sb_url()}/rest/v1/posts?id=eq.{post_id}&select=*",
            headers=anon_headers(),
        )
        rows = post_resp.json()
        if not rows:
            return JSONResponse(
                status_code=404,
                content={"data": None, "error": "Post not found"},
            )
        comments_resp = await client.get(
            f"{sb_url()}/rest/v1/comments?post_id=eq.{post_id}&select=*&order=created_at.asc",
            headers=anon_headers(),
        )

    post = rows[0]
    post["comments"] = comments_resp.json()
    return {"data": post, "error": None}


@router.post("")
async def create_post(body: PostBody, authorization: str = Header(None)):
    user = await get_user(authorization)
    if not user:
        return JSONResponse(
            status_code=401,
            content={"data": None, "error": "Not authenticated"},
        )
    token = extract_token(authorization)
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{sb_url()}/rest/v1/posts",
            headers={**auth_headers(token), "Prefer": "return=representation"},
            json={"title": body.title, "content": body.content, "user_id": user["id"]},
        )
    data = resp.json()
    if resp.status_code not in (200, 201):
        return JSONResponse(
            status_code=400,
            content={"data": None, "error": "Failed to create post"},
        )
    return {"data": data[0] if data else None, "error": None}


@router.delete("/{post_id}")
async def delete_post(post_id: str, authorization: str = Header(None)):
    user = await get_user(authorization)
    if not user:
        return JSONResponse(
            status_code=401,
            content={"data": None, "error": "Not authenticated"},
        )
    token = extract_token(authorization)
    async with httpx.AsyncClient() as client:
        resp = await client.delete(
            f"{sb_url()}/rest/v1/posts?id=eq.{post_id}&user_id=eq.{user['id']}",
            headers={**auth_headers(token), "Prefer": "return=representation"},
        )
    if not resp.json():
        return JSONResponse(
            status_code=403,
            content={"data": None, "error": "Post not found or not authorized"},
        )
    return {"data": {"deleted": True}, "error": None}
