from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.models.user import User
from app.schemas import user
from app.utils import auth
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

@router.post("/register")
async def register(user_data: user.UserCreate, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user_data.email).first()

    if db_user:
        raise HTTPException(status_code=400, detail="Email is already registered...")

    raw_password = user_data.password
    secured_password = auth.hash_password(raw_password[:72])

    time = str(date.today())

    new_user = User(
        email = user_data.email,
        username = user_data.username,
        hashed_password = secured_password,
        created_at = time
    )

    db.add(new_user)
    db.commit()

    return({"message":"User created successfully"}, new_user)

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    
    db_user = db.query(User).filter(User.email == form_data.username).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid Credentials")

    if not auth.verify_password(form_data.password[:72], db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    
    data = {"sub": str(db_user.id)}
    access_token = auth.create_token(data) 

    return {"access_token": access_token, "token_type": "bearer"}