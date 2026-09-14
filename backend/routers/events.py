from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import schemas, models
from database import get_db

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.get("", response_model=List[schemas.DetectionEventResponse])
def get_events(
    vehicle_id: Optional[str] = None,
    camera_id: Optional[int] = None,
    detection_class: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(models.DetectionEvent)
    
    if vehicle_id:
        query = query.filter(models.DetectionEvent.vehicle_id == vehicle_id)
    if camera_id:
        query = query.filter(models.DetectionEvent.camera_id == camera_id)
    if detection_class:
        query = query.filter(models.DetectionEvent.detection_class == detection_class)
        
    events = query.order_by(models.DetectionEvent.timestamp.desc()).offset(skip).limit(limit).all()
    return events

@router.get("/vehicle/{vehicle_id}", response_model=schemas.VehicleHistoryResponse)
def get_vehicle_history(vehicle_id: str, db: Session = Depends(get_db)):
    events = db.query(models.DetectionEvent)\
        .filter(models.DetectionEvent.vehicle_id == vehicle_id)\
        .order_by(models.DetectionEvent.timestamp.asc())\
        .all()
        
    return {
        "vehicle_id": vehicle_id,
        "events": events
    }

@router.get("/{event_id}", response_model=schemas.DetectionEventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.DetectionEvent).filter(models.DetectionEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event
