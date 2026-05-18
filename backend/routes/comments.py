import httpx
from fastapi import APIRouter, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from routes.supabase import sb_url, auth_headers, get_user, extract_token

router = APIRouter(prefix="/comments")


class CommentBody(BaseModel):
    post_id: str
    content: str


@router.post("")
async def create_comment(body: CommentBody, authorization: str = Header(None)):
    user = await get_user(authorization)
    if not user:
        return JSONResponse(
            status_code=401,
            content={"data": None, "error": "Not authenticated"},
        )
    token = extract_token(authorization)
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{sb_url()}/rest/v1/comments",
            headers={**auth_headers(token), "Prefer": "return=representation"},
            json={"post_id": body.post_id, "content": body.content, "user_id": user["id"]},
        )
    data = resp.json()
    if resp.status_code not in (200, 201):
        return JSONResponse(
            status_code=400,
            content={"data": None, "error": "Failed to create comment"},
        )
    return {"data": data[0] if data else None, "error": None}


@router.delete("/{comment_id}")
async def delete_comment(comment_id: str, authorization: str = Header(None)):
    user = await get_user(authorization)
    if not user:
        return JSONResponse(
            status_code=401,
            content={"data": None, "error": "Not authenticated"},
        )
    token = extract_token(authorization)
    async with httpx.AsyncClient() as client:
        resp = await client.delete(
            f"{sb_url()}/rest/v1/comments?id=eq.{comment_id}&user_id=eq.{user['id']}",
            headers={**auth_headers(token), "Prefer": "return=representation"},
        )
    if not resp.json():
        return JSONResponse(
            status_code=403,
            content={"data": None, "error": "Comment not found or not authorized"},
        )
    return {"data": {"deleted": True}, "error": None}
