from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from sqlalchemy.orm import Session

from services import analytics_service
from database import get_db
from models import Camera

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

class AnalyticsRequest(BaseModel):
    camera_ids: List[int]

class AnalyticsResponse(BaseModel):
    message: str
    affected_cameras: List[int]

@router.post("/start", response_model=AnalyticsResponse)
def start_analytics(request: AnalyticsRequest, db: Session = Depends(get_db)):
    cameras = db.query(Camera).filter(Camera.id.in_(request.camera_ids)).all()
    cam_mapping = {c.id: c.camera_code for c in cameras}
    
    started = analytics_service.start_analytics(request.camera_ids, cam_mapping)
    return {"message": "Analytics started", "affected_cameras": started}

@router.post("/stop", response_model=AnalyticsResponse)
def stop_analytics(request: AnalyticsRequest):
    stopped = analytics_service.stop_analytics(request.camera_ids)
    return {"message": "Analytics stopped", "affected_cameras": stopped}

@router.get("/status")
def get_analytics_status():
    return analytics_service.get_active_sessions()

from fastapi.responses import StreamingResponse

@router.get("/stream/{camera_id}")
def stream_camera(camera_id: int):
    # Check if active
    sessions = analytics_service.get_active_sessions()
    if camera_id not in sessions or sessions[camera_id].get("status") not in ["ACTIVE", "CONNECTING"]:
        raise HTTPException(status_code=404, detail="Camera analytics not active")
    
    return StreamingResponse(
        analytics_service.get_stream(camera_id),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )
