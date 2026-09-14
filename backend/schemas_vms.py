from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class VMSRegistrationRequest(BaseModel):
    name: str
    vendor: str
    host: str
    credentials: Optional[Dict[str, str]] = None

class VMSResponse(BaseModel):
    id: str
    name: str
    vendor: str
    host: str
    status: str

class VMSStatusResponse(BaseModel):
    vms_id: str
    name: str
    vendor: str
    connected: bool
    host: str

class VMSCameraResponse(BaseModel):
    camera_code: str
    camera_name: str
    department: str
    location_name: str
    status: str
    protocol: str
    vms_id: str
