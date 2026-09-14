from pydantic import BaseModel, ConfigDict
from typing import Optional, Any
from datetime import datetime
from models import ProtocolEnum, StatusEnum

class CameraBase(BaseModel):
    camera_code: str
    camera_name: str
    department: str
    location_name: str
    latitude: float
    longitude: float
    stream_url: str
    protocol: ProtocolEnum = ProtocolEnum.RTSP
    status: StatusEnum = StatusEnum.ACTIVE

class CameraCreate(CameraBase):
    pass

class CameraUpdate(BaseModel):
    camera_name: Optional[str] = None
    department: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    stream_url: Optional[str] = None
    protocol: Optional[ProtocolEnum] = None
    status: Optional[StatusEnum] = None

class CameraResponse(CameraBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class WatchlistBase(BaseModel):
    type: str
    identifier: str
    name: Optional[str] = None
    description: Optional[str] = None
    status: str = "ACTIVE"

class WatchlistCreate(WatchlistBase):
    pass

class WatchlistResponse(WatchlistBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    camera_id: int
    watchlist_id: int
    detection_class: str
    confidence: float
    status: str = "NEW"
    message: Optional[str] = None

class AlertResponse(AlertBase):
    id: int
    timestamp: datetime
    
    # We might want to include nested objects for UI
    # camera: Optional[CameraResponse] = None
    # watchlist: Optional[WatchlistResponse] = None

    class Config:
        from_attributes = True

class DetectionEventBase(BaseModel):
    camera_id: int
    vehicle_id: str
    detection_class: str
    confidence: float
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    source: str = "DEMO"
    is_demo: bool = True

class DetectionEventResponse(DetectionEventBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class VehicleHistoryResponse(BaseModel):
    vehicle_id: str
    events: list[DetectionEventResponse]
