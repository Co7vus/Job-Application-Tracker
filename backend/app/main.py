from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message":"Hello Dog"}

@app.get("/health")
async def health():
    return {"messsage":"ok"}