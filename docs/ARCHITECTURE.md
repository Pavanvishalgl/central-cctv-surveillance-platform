# Architecture Overview

This document details the architecture of the Gujarat CCTV Intelligence System. It outlines the real, currently deployed components of the MVP.

## Logical Layers

```mermaid
flowchart TD
    Users[Users / Operators] --> WebFrontend
    
    subgraph "Frontend Layer"
        WebFrontend[Web Frontend (React/Vite)]
    end
    
    WebFrontend --> FastAPILayer
    
    subgraph "Backend Layer"
        FastAPILayer[FastAPI API Layer]
        CCTVRegistry[CCTV Registry / GIS Services]
        AnalyticsLayer[Analytics & Stream Services]
        VMS[VMS Federation]
        Events[Watchlist, Alerts & Detection Events]
    end
    
    FastAPILayer --> CCTVRegistry
    FastAPILayer --> AnalyticsLayer
    FastAPILayer --> VMS
    FastAPILayer --> Events
    
    subgraph "AI / Vision Layer"
        YOLO[YOLO11n Object Detection]
        OpenCV[OpenCV Stream Decoding]
    end
    
    AnalyticsLayer --> OpenCV
    OpenCV --> YOLO
    YOLO --> Events
    
    subgraph "External Network"
        Sentinel[30 Sentinel Camera Network]
        ExternalVMS[3rd-Party VMS Vendors]
    end
    
    Sentinel -- "RTSP / TCP" --> OpenCV
    VMS -.-> ExternalVMS
    
    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL + PostGIS)]
    end
    
    CCTVRegistry --> PostgreSQL
    Events --> PostgreSQL
```

## Real Implemented Components

### 1. Sentinel Camera Network
- The system currently securely integrates with a real-world network of **30 Sentinel cameras**. 
- Camera feeds are acquired via authenticated RTSP over TCP. 
- Credentials remain strictly server-side inside environment variables and are never leaked to the frontend client.

### 2. FastAPI API Layer
- **Web Server**: Uvicorn running ASGI FastAPI. 
- Handles concurrent connection polling, RESTful routing, and MJPEG boundary streaming without blocking the event loop.

### 3. CCTV Registry / GIS
- **Models**: Built on SQLAlchemy. 
- **Spatial Features**: Powered by GeoAlchemy2 and PostGIS, treating camera locations as WGS84 `POINT` geometries.
- **Frontend**: Map rendered using Leaflet via React-Leaflet, pulling dynamic JSON coordinates.

### 4. Analytics & Stream Services
- **Threading**: Selected streams spawn isolated Python `threading.Thread` workers.
- **Decoding**: `cv2.VideoCapture` extracts the raw frames leveraging FFMPEG and forces TCP transport to avoid UDP packet loss on unstable networks.
- **Transcoding**: Frames are heavily compressed into `.jpg` buffers and yielded down to the React frontend through a FastAPI `StreamingResponse` (MJPEG stream).

### 5. YOLO11n
- The state-of-the-art YOLO11 nano model is loaded into memory upon backend startup.
- The thread passes frames to the Ultralytics engine to compute spatial bounding boxes, class names, and confidences on the fly.
- Rendered boxes are embedded directly onto the MJPEG frames for visual confirmation.

### 6. Watchlist, Alerts & Detection Events
- **Watchlist**: Operators can maintain a list of target entity classifications (e.g., "car", "truck").
- **Alerts**: When YOLO11n detects a class that intersects with the active Watchlist, an Alert row is dynamically inserted.
- **Detection Events**: Standardized historical movement tables log the spatio-temporal trail of bounding boxes for retroactive search and tracking.

### 7. VMS Federation
- Abstracted layer to handle integration schemas for bridging external 3rd-party vendor camera clusters seamlessly into the master GIS map.

## Planned / Future Scaling Components
*Note: The following are conceptual scaling elements not present in the current MVP.*
- Message Queues (Kafka) for decoupling frame acquisition from AI inference.
- Microservice pod-scaling for isolated Analytics Workers in Kubernetes.
- GPU clustering for heavy re-identification (ReID) models and ANPR.
- Refer to `docs/SCALABILITY.md` for the roadmap.
