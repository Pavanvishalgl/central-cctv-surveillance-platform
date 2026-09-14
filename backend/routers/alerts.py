from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Alert
import schemas

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("/", response_model=List[schemas.AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).order_by(Alert.timestamp.desc()).all()
