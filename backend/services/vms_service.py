import uuid
from typing import Dict, List, Optional
from adapters.vms_base import VMSAdapter
from adapters.mock_vms import MockVMSAdapter

# In-memory registry mapping VMS ID -> VMSAdapter instance
_vms_registry: Dict[str, VMSAdapter] = {}

def register_vms(name: str, vendor: str, host: str, credentials: dict = None) -> VMSAdapter:
    vms_id = str(uuid.uuid4())
    
    # Factory pattern: instantiate the correct adapter based on vendor
    if vendor.lower() == "mock" or vendor.lower() == "simulated":
        adapter = MockVMSAdapter(vms_id, name, host, credentials)
    else:
        # Default to mock for demonstration if unknown vendor
        adapter = MockVMSAdapter(vms_id, name, host, credentials)
        
    _vms_registry[vms_id] = adapter
    return adapter

def get_all_vms() -> List[VMSAdapter]:
    return list(_vms_registry.values())

def get_vms(vms_id: str) -> Optional[VMSAdapter]:
    return _vms_registry.get(vms_id)

def remove_vms(vms_id: str) -> bool:
    if vms_id in _vms_registry:
        # Attempt to cleanly disconnect before removing
        try:
            _vms_registry[vms_id].disconnect()
        except:
            pass
        del _vms_registry[vms_id]
        return True
    return False
