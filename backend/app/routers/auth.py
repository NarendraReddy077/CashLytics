from fastapi import APIRouter, HTTPException, status
from app.utils import get_supabase_anon
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["Authentication"])


class AuthRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    user_id: str
    email: str


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: AuthRequest):
    """Register a new user with email and password."""
    try:
        supabase = await get_supabase_anon()
        response = await supabase.auth.sign_up(
            {"email": payload.email, "password": payload.password}
        )
        if response.user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Signup failed. The email may already be registered.",
            )
        
        # If email confirmation is enabled, session might be null
        if response.session is None:
            raise HTTPException(
                status_code=status.HTTP_200_OK,
                detail="Confirmation email sent. Please check your inbox.",
            )

        return AuthResponse(
            access_token=response.session.access_token,
            user_id=response.user.id,
            email=response.user.email,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/login", response_model=AuthResponse)
async def login(payload: AuthRequest):
    """Authenticate with email and password."""
    try:
        supabase = await get_supabase_anon()
        response = await supabase.auth.sign_in_with_password(
            {"email": payload.email, "password": payload.password}
        )
        if response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        return AuthResponse(
            access_token=response.session.access_token,
            user_id=response.user.id,
            email=response.user.email,
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout():
    """Sign out the current user."""
    try:
        supabase = await get_supabase_anon()
        await supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed",
        )
