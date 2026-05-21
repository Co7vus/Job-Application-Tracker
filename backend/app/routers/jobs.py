from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import job
from app.models.user import User
from app.models.job import Job
from app.utils.auth import get_current_user
from app.database import get_db
from sqlalchemy import func
from typing import List

router = APIRouter()

@router.post("/", response_model=job.JobResponse)
async def create_job(job_data: job.JobCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_job = Job(
        user_id=current_user.id,
        company=job_data.company,
        role=job_data.role,
        status=job_data.status,
        notes=job_data.notes,
        salary=job_data.salary,
        applied_date=job_data.applied_date,
        followup_date=job_data.followup_date
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.get("/", response_model=List[job.JobResponse])
async def get_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Job).filter(Job.user_id == current_user.id).all()

@router.patch("/{job_id}", response_model=job.JobResponse)
async def update_job(job_id: int, job_data: job.JobUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    for key, value in job_data.dict(exclude_unset=True).items():
        setattr(db_job, key, value)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.delete("/{job_id}")
async def delete_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(db_job)
    db.commit()
    return {"message": "Job deleted"}

@router.get("/stats")
async def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job_data = db.query(Job.status, func.count(Job.status)).filter(Job.user_id == current_user.id).group_by(Job.status).all()
    statuses = {status: count for status, count in job_data}
    return {"total": sum(statuses.values()), "by_status": statuses}