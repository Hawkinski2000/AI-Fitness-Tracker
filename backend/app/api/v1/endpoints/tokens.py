from fastapi import status, APIRouter, Depends, HTTPException, Response, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import bcrypt
from datetime import datetime, timezone, timedelta
import app.core.oauth2 as oauth2
from app.core.db import get_db
from app.schemas import token
from app.models.models import User, RefreshToken


router = APIRouter(prefix="/api/tokens",
                   tags=['Tokens'])

# Create a token
@router.post("", status_code=status.HTTP_201_CREATED, response_model=token.TokenResponse)
def create_token(response: Response,
                 user_credentials: OAuth2PasswordRequestForm = Depends(),
                 db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.username).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")

    password = user_credentials.password.encode("utf-8")
    password_hash = user.password_hash.encode("utf-8")
    
    if not bcrypt.checkpw(password, password_hash):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid credentials")

    access_token = oauth2.create_access_token(data={"user_id": user.id})

    raw_token = oauth2.generate_refresh_token()
    token_hash = oauth2.hash_token(raw_token)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=24)

    new_refresh_token = RefreshToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at
    )
    db.add(new_refresh_token)
    db.commit()

    oauth2.set_refresh_cookie(response, raw_token, 24 * 3600)

    return {"access_token": access_token, "token_type": "bearer"}

# Refresh an access token using a valid refresh token
@router.post("/refresh")
def refresh_token(response: Response,
                  refresh_token: str = Cookie(default=None, alias="refresh_token"),
                  db: Session = Depends(get_db)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    token_hash = oauth2.hash_token(refresh_token)

    db_token = (
        db.query(RefreshToken)
        .filter(RefreshToken.token_hash == token_hash)
        .first()
    )

    if (
        not db_token
        or db_token.revoked
        or db_token.expires_at < datetime.now(timezone.utc)
    ):
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    db_token.revoked = True

    access_token = oauth2.create_access_token({"user_id": db_token.user_id})

    raw_token = oauth2.generate_refresh_token()
    token_hash = oauth2.hash_token(raw_token)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=24)

    new_refresh_token = RefreshToken(
        user_id=db_token.user_id,
        token_hash=token_hash,
        expires_at=expires_at
    )
    db.add(new_refresh_token)
    db.commit()

    oauth2.set_refresh_cookie(response, raw_token, 24 * 3600)

    return {"access_token": access_token, "token_type": "bearer"}

# Revoke a refresh token (a user logs out)
@router.post("/revoke")
def revoke_token(response: Response,
                 refresh_token: str = Cookie(default=None, alias="refresh_token"),
                 db: Session = Depends(get_db)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    token_hash = oauth2.hash_token(refresh_token)

    db_token = (
        db.query(RefreshToken)
        .filter(RefreshToken.token_hash == token_hash)
        .first()
    )

    if db_token:
        db_token.revoked = True
        db.commit()

    response.delete_cookie(key="refresh_token", path="/api/tokens")

    return {"detail": "Refresh token revoked"}
