# backend/api/auth.py
from fastapi import APIRouter, HTTPException, Depends
from backend.config import get_connection_string
from backend.schemas.auth import UserRegister, UserLogin, Token
from backend.core.security import get_password_hash, verify_password, create_access_token
from psycopg.rows import dict_row
import psycopg

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user: UserRegister):
    conn = psycopg.connect(get_connection_string())
    with conn.cursor(row_factory=dict_row) as cursor:
        # 1. Check if user exists
        cursor.execute("SELECT usr_id FROM public.users WHERE email = %s", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")

        # 2. Hash password
        hashed_password = get_password_hash(user.password)

        # 3. Insert user (Defaulting to Individual account type 'act_id=1', status 'sta_id=1')
        cursor.execute("""
            INSERT INTO public.users (act_id, sta_id, first_name, last_name, email, password_hash)
            VALUES (1, 1, %s, %s, %s, %s)
            RETURNING usr_id, first_name, last_name
        """, (user.first_name, user.last_name, user.email, hashed_password))
        
        new_user = cursor.fetchone()
        conn.commit()

    # 4. Generate Token
    access_token = create_access_token(data={"sub": str(new_user["usr_id"]), "role": "individual"})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(user: UserLogin):
    conn = psycopg.connect(get_connection_string())
    with conn.cursor(row_factory=dict_row) as cursor:
        # 1. Find user
        cursor.execute("SELECT usr_id, password_hash FROM public.users WHERE email = %s", (user.email,))
        db_user = cursor.fetchone()

    conn.close()

    # 2. Verify user and password
    if not db_user or not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    # 3. Generate Token
    access_token = create_access_token(data={"sub": str(db_user["usr_id"])})
    return {"access_token": access_token, "token_type": "bearer"}