import os
import httpx


def sb_url() -> str:
    return os.getenv("SUPABASE_URL")


def sb_key() -> str:
    return os.getenv("SUPABASE_ANON_KEY")


def anon_headers() -> dict:
    key = sb_key()
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }


def auth_headers(token: str) -> dict:
    return {
        "apikey": sb_key(),
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }


def extract_token(authorization: str) -> str:
    return authorization.split(" ")[1]


async def get_user(authorization: str | None) -> dict | None:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = extract_token(authorization)
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{sb_url()}/auth/v1/user",
            headers={"apikey": sb_key(), "Authorization": f"Bearer {token}"},
        )
    return resp.json() if resp.status_code == 200 else None
