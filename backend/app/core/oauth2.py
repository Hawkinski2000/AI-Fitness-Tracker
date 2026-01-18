from fastapi import status, Depends, HTTPException, Response
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timezone, timedelta
import secrets
import hashlib
import requests
from .config import settings
from app.schemas.token import TokenData


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="tokens")

def create_access_token(data: dict):
    to_encode = data.copy()    

    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

    return encoded_jwt

def verify_access_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, settings.secret_key, [settings.algorithm])

        user_id: str = payload.get("user_id")

        if user_id is None:
            raise credentials_exception
        
        token_data = TokenData(user_id=user_id)

    except InvalidTokenError:
        raise credentials_exception
    
    return token_data

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not validate credentials",
                                          headers={"WWW-Authenticate": "Bearer"})
    return verify_access_token(token, credentials_exception)

# ----------------------------------------------------------------------------

def verify_google_access_token(access_token: str) -> dict:
    response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Google access token")

    return response.json()

# ----------------------------------------------------------------------------

def generate_refresh_token():
    return secrets.token_urlsafe(48)

def hash_token(token: str):
    return hashlib.sha256(token.encode()).hexdigest()

def set_refresh_cookie(response: Response, raw_token: str, max_age_seconds: int):
    response.set_cookie(
        key="refresh_token",
        value=raw_token,
        max_age=max_age_seconds,
        httponly=True,
        secure=True,
        samesite="Lax",
        path="/"
    )
