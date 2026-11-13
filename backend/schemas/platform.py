from pydantic import BaseModel, EmailStr
from typing import Optional

class HeadOfficeCreate(BaseModel):
    head_off_name: str
    email: Optional[EmailStr] = None
    phone_no: Optional[str] = None
    city: Optional[str] = None

class CampusCreate(BaseModel):
    head_off_id: int
    cam_name: str
    email: Optional[EmailStr] = None
    phone_no: Optional[str] = None
    city: Optional[str] = None

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role_name: str # e.g., 'organisation_admin', 'campus_admin', 'teacher'
    head_off_id: Optional[int] = None
    cam_id: Optional[int] = None