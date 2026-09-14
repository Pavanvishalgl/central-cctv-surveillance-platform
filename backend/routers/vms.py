from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import schemas_vms
from services import vms_service

router = APIRouter(prefix="/api/vms", tags=["VMS Federation"])

@router.post("", response_model=schemas_vms.VMSResponse)
def register_vms(request: schemas_vms.VMSRegistrationRequest):
    adapter = vms_service.register_vms(
        name=request.name,
        vendor=request.vendor,
        host=request.host,
        credentials=request.credentials
    )
    return {
        "id": adapter.vms_id,
        "name": adapter.name,
        "vendor": request.vendor,
        "host": adapter.host,
        "status": "REGISTERED"
    }

@router.get("", response_model=List[schemas_vms.VMSStatusResponse])
def list_vms():
    adapters = vms_service.get_all_vms()
    return [adapter.get_status() for adapter in adapters]

@router.get("/{vms_id}", response_model=schemas_vms.VMSStatusResponse)
def get_vms(vms_id: str):
    adapter = vms_service.get_vms(vms_id)
    if not adapter:
        raise HTTPException(status_code=404, detail="VMS not found")
    return adapter.get_status()

@router.delete("/{vms_id}")
def unregister_vms(vms_id: str):
    success = vms_service.remove_vms(vms_id)
    if not success:
        raise HTTPException(status_code=404, detail="VMS not found")
    return {"message": "VMS unregistered successfully"}

@router.post("/{vms_id}/connect")
def connect_vms(vms_id: str):
    adapter = vms_service.get_vms(vms_id)
    if not adapter:
        raise HTTPException(status_code=404, detail="VMS not found")
    try:
        adapter.connect()
        return {"message": "Connected successfully", "status": adapter.get_status()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Connection failed: {str(e)}")

@router.post("/{vms_id}/disconnect")
def disconnect_vms(vms_id: str):
    adapter = vms_service.get_vms(vms_id)
    if not adapter:
        raise HTTPException(status_code=404, detail="VMS not found")
    adapter.disconnect()
    return {"message": "Disconnected successfully", "status": adapter.get_status()}

@router.get("/{vms_id}/cameras", response_model=List[schemas_vms.VMSCameraResponse])
def get_vms_cameras(vms_id: str):
    adapter = vms_service.get_vms(vms_id)
    if not adapter:
        raise HTTPException(status_code=404, detail="VMS not found")
    try:
        return adapter.get_cameras()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
