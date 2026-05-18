import httpx
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from routes.supabase import sb_url, sb_key

router = APIRouter(prefix="/auth")


def _headers() -> dict:
    return {"apikey": sb_key(), "Content-Type": "application/json"}


class AuthRequest(BaseModel):
    email: str
    password: str


@router.post("/signup")
async def signup(body: AuthRequest):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{sb_url()}/auth/v1/signup",
            headers=_headers(),
            json={"email": body.email, "password": body.password},
        )
    data = resp.json()
    if resp.status_code not in (200, 201):
        return JSONResponse(
            status_code=400,
            content={"data": None, "error": data.get("msg", "Signup failed")},
        )
    return {"data": data, "error": None}


@router.post("/login")
async def login(body: AuthRequest):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{sb_url()}/auth/v1/token?grant_type=password",
            headers=_headers(),
            json={"email": body.email, "password": body.password},
        )
    data = resp.json()
    if resp.status_code != 200:
        return JSONResponse(
            status_code=401,
            content={"data": None, "error": data.get("error_description", "Login failed")},
        )
    return {"data": data, "error": None}
