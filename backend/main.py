from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db, engine, Base
from routers import cameras, analytics, vms, watchlist, alerts, events
import models

app = FastAPI(title="Gujarat CCTV Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cameras.router)
app.include_router(analytics.router)
app.include_router(vms.router)
app.include_router(watchlist.router)
app.include_router(alerts.router)
app.include_router(events.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Gujarat CCTV Intelligence API"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"disconnected: {str(e)}"
        raise HTTPException(status_code=503, detail=f"Database connectivity failed: {db_status}")
        
    return {
        "status": "healthy", 
        "database": db_status
    }
