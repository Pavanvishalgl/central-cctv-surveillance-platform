from sqlalchemy import Column, Integer, String, DateTime, Enum, Float, Boolean
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from database import Base
import enum

class ProtocolEnum(str, enum.Enum):
    RTSP = "RTSP"
    HTTP = "HTTP"
    ONVIF = "ONVIF"

class StatusEnum(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    MAINTENANCE = "MAINTENANCE"

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)
    camera_code = Column(String, unique=True, index=True, nullable=False)
    camera_name = Column(String, nullable=False)
    department = Column(String, nullable=False)
    location_name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    # PostGIS geometry field. SRID 4326 is WGS84 (standard GPS coordinates)
    geom = Column(Geometry(geometry_type='POINT', srid=4326))
    
    stream_url = Column(String, nullable=False)
    protocol = Column(Enum(ProtocolEnum), default=ProtocolEnum.RTSP)
    status = Column(Enum(StatusEnum), default=StatusEnum.ACTIVE)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

from sqlalchemy import ForeignKey

class WatchlistTypeEnum(str, enum.Enum):
    STOLEN_VEHICLE = "stolen_vehicle"
    BLACKLISTED_VEHICLE = "blacklisted_vehicle"
    WANTED_PERSON = "wanted_person"
    MISSING_PERSON = "missing_person"
    SUSPECT = "suspect"

class Watchlist(Base):
    __tablename__ = "watchlist"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(WatchlistTypeEnum), nullable=False)
    identifier = Column(String, nullable=False)  # e.g., 'car', 'person', 'truck'
    name = Column(String)
    description = Column(String)
    status = Column(Enum(StatusEnum), default=StatusEnum.ACTIVE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    camera_id = Column(Integer, ForeignKey("cameras.id"))
    watchlist_id = Column(Integer, ForeignKey("watchlist.id"))
    detection_class = Column(String)
    confidence = Column(Float)
    status = Column(String, default="NEW")
    message = Column(String)

class DetectionEvent(Base):
    __tablename__ = "detection_events"
    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, ForeignKey("cameras.id"))
    vehicle_id = Column(String, index=True)
    detection_class = Column(String)
    confidence = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    latitude = Column(Float)
    longitude = Column(Float)
    source = Column(String, default="DEMO")
    is_demo = Column(Boolean, default=True)
