from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import schemas, models
from database import get_db

router = APIRouter(prefix="/api/cameras", tags=["Cameras"])

@router.get("", response_model=List[schemas.CameraResponse])
def get_cameras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cameras = db.query(models.Camera).offset(skip).limit(limit).all()
    return cameras

@router.get("/{camera_id}", response_model=schemas.CameraResponse)
def get_camera(camera_id: int, db: Session = Depends(get_db)):
    camera = db.query(models.Camera).filter(models.Camera.id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera

@router.post("", response_model=schemas.CameraResponse, status_code=status.HTTP_201_CREATED)
def create_camera(camera: schemas.CameraCreate, db: Session = Depends(get_db)):
    db_camera = db.query(models.Camera).filter(models.Camera.camera_code == camera.camera_code).first()
    if db_camera:
        raise HTTPException(status_code=400, detail="Camera code already registered")
        
    geom_wkt = f"POINT({camera.longitude} {camera.latitude})"
    
    new_camera = models.Camera(
        **camera.model_dump(),
        geom=geom_wkt
    )
    db.add(new_camera)
    db.commit()
    db.refresh(new_camera)
    return new_camera

@router.put("/{camera_id}", response_model=schemas.CameraResponse)
def update_camera(camera_id: int, camera_update: schemas.CameraUpdate, db: Session = Depends(get_db)):
    db_camera = db.query(models.Camera).filter(models.Camera.id == camera_id).first()
    if not db_camera:
        raise HTTPException(status_code=404, detail="Camera not found")
        
    update_data = camera_update.model_dump(exclude_unset=True)
    
    if "latitude" in update_data or "longitude" in update_data:
        new_lat = update_data.get("latitude", db_camera.latitude)
        new_lon = update_data.get("longitude", db_camera.longitude)
        db_camera.geom = f"POINT({new_lon} {new_lat})"
        
    for key, value in update_data.items():
        setattr(db_camera, key, value)
        
    db.commit()
    db.refresh(db_camera)
    return db_camera

@router.delete("/{camera_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_camera(camera_id: int, db: Session = Depends(get_db)):
    db_camera = db.query(models.Camera).filter(models.Camera.id == camera_id).first()
    if not db_camera:
        raise HTTPException(status_code=404, detail="Camera not found")
        
    db.delete(db_camera)
    db.commit()
    return None
