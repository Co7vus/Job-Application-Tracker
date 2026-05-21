from pydantic import BaseModel
from typing import Optional

class JobCreate(BaseModel):
    company:str
    role:str
    status:str = "Applied"
    notes: Optional[str] = None
    salary: Optional[str] = None
    applied_date: str
    followup_date: Optional[str] = None

class JobUpdate(BaseModel):
    company:Optional[str] = None
    role:Optional[str] = None
    status:Optional[str] = None
    notes: Optional[str] = None
    salary: Optional[str] = None
    followup_date: Optional[str] = None
    
class JobResponse(BaseModel):
    id: int
    user_id: int
    company: str
    role: str
    status: str
    notes: Optional[str] = None
    salary: Optional[str] = None
    applied_date: str
    followup_date: Optional[str] =  None

