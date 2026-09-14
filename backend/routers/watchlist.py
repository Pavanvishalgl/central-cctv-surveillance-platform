from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Watchlist, StatusEnum
import schemas

router = APIRouter(prefix="/api/watchlist", tags=["Watchlist"])

@router.get("/", response_model=List[schemas.WatchlistResponse])
def get_watchlist(db: Session = Depends(get_db)):
    return db.query(Watchlist).all()

@router.post("/", response_model=schemas.WatchlistResponse)
def create_watchlist_entry(entry: schemas.WatchlistCreate, db: Session = Depends(get_db)):
    new_entry = Watchlist(**entry.model_dump())
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    from services.analytics_service import refresh_watchlist
    refresh_watchlist(db)
    return new_entry
