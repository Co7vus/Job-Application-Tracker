from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, jobs
from app.database import Base, engine
from app.models import user, job

# assigning app var to FastApi
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",  "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# this initialises the databases and create them if not created
Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth") # this basically tells the website to include routers in auth.py file
app.include_router(jobs.router, prefix="/jobs")

#GET Methods

# root
@app.get("/")
async def root():
    return {"message":"Hello World"} # this displays a Hello World

# health route
@app.get("/health")
async def health():
    return {"messsage":"ok"} # just displays an ok