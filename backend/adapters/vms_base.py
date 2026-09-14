from abc import ABC, abstractmethod
from typing import List, Dict, Any

class VMSAdapter(ABC):
    """
    Abstract base class for all VMS (Video Management System) integrations.
    Real vendor SDK wrappers will inherit from this class.
    """
    
    def __init__(self, vms_id: str, name: str, host: str, credentials: dict = None):
        self.vms_id = vms_id
        self.name = name
        self.host = host
        self.credentials = credentials or {}
        self.is_connected = False

    @abstractmethod
    def connect(self) -> bool:
        """Establish connection to the VMS."""
        pass

    @abstractmethod
    def disconnect(self) -> bool:
        """Close connection to the VMS."""
        pass

    @abstractmethod
    def get_cameras(self) -> List[Dict[str, Any]]:
        """Retrieve list of cameras managed by this VMS."""
        pass

    @abstractmethod
    def get_stream_url(self, camera_id: str) -> str:
        """Retrieve the streaming URL for a specific camera in this VMS."""
        pass

    @abstractmethod
    def get_status(self) -> Dict[str, Any]:
        """Check the health and connection status of the VMS."""
        pass
