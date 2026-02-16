import logging
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils import get_supabase_anon

logger = logging.getLogger(__name__)
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Validate the Supabase JWT and return the authenticated user."""
    token = credentials.credentials
    try:
        supabase = await get_supabase_anon()
        response = await supabase.auth.get_user(token)
        if response.user is None:
            logger.warning("Token validation returned no user")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        return {"id": response.user.id, "email": response.user.email}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Auth validation failed: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
