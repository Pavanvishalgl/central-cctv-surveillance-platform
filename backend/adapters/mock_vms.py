from typing import List, Dict, Any
from .vms_base import VMSAdapter
import time
import uuid

class MockVMSAdapter(VMSAdapter):
    """
    A simulated VMS adapter used to demonstrate federation architecture.
    """
    
    def connect(self) -> bool:
        # Simulate network latency and connection logic
        time.sleep(0.1)
        self.is_connected = True
        return True

    def disconnect(self) -> bool:
        self.is_connected = False
        return True

    def get_cameras(self) -> List[Dict[str, Any]]:
        if not self.is_connected:
            raise ConnectionError(f"VMS {self.name} is not connected.")
            
        # Generate simulated camera lists based on the vendor name
        cameras = []
        vendor_prefix = self.name.split()[0].upper()[:3]
        
        for i in range(1, 4):
            cameras.append({
                "camera_code": f"{vendor_prefix}-FED-{i:03d}",
                "camera_name": f"{self.name} Federated Cam {i}",
                "department": f"{self.name} Network",
                "location_name": f"Federated Zone {i}",
                "status": "ACTIVE",
                "protocol": "RTSP",
                "vms_id": self.vms_id
            })
        return cameras

    def get_stream_url(self, camera_id: str) -> str:
        if not self.is_connected:
            raise ConnectionError(f"VMS {self.name} is not connected.")
        return f"rtsp://{self.host}:554/stream/{camera_id}"

    def get_status(self) -> Dict[str, Any]:
        return {
            "vms_id": self.vms_id,
            "name": self.name,
            "vendor": "MOCK_VENDOR",
            "connected": self.is_connected,
            "host": self.host
        }
