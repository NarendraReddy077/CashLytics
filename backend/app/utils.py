from supabase._async.client import AsyncClient, create_client
from app.config import get_settings

_anon_client: AsyncClient | None = None
_service_client: AsyncClient | None = None


async def get_supabase_anon() -> AsyncClient:
    """Return a singleton async Supabase client using the anon key (for auth ops)."""
    global _anon_client
    if _anon_client is None:
        settings = get_settings()
        _anon_client = await create_client(
            settings.supabase_url,
            settings.supabase_key,
        )
    return _anon_client


async def get_supabase() -> AsyncClient:
    """Return a singleton async Supabase client using the service role key (for data ops)."""
    global _service_client
    if _service_client is None:
        settings = get_settings()
        _service_client = await create_client(
            settings.supabase_url,
            settings.supabase_service_role_key,
        )
    return _service_client
