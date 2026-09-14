# Gujarat CCTV Intelligence System (MVP)

## 1. Problem Statement
Managing a massive network of CCTV cameras requires more than just viewing video streams. Security operators face challenges in situational awareness, real-time analytics, handling vast amounts of unstructured video data, and integrating disparate Vendor Management Systems (VMS).

## 2. Solution Overview
The Gujarat CCTV Intelligence System is a central registry and analytics platform that bridges the gap between raw camera streams and actionable intelligence. This MVP demonstrates a highly modular architecture capable of ingesting RTSP streams, performing real-time AI object detection, managing watchlists and alerts, and offering a unified GIS-based visualization interface.

## 3. Key Capabilities
- **Central CCTV Registry**: Complete database of 30 Sentinel cameras.
- **GIS Visualization**: Spatial mapping of camera locations and events using PostGIS and Leaflet.
- **Unified Live Monitoring**: Centralized dashboard for stream viewing.
- **Sentinel RTSP/TCP Ingestion**: Secure backend ingestion of authenticated RTSP streams over TCP.
- **YOLO11n Analytics**: Real-time object detection processing.
- **Watchlist**: Management of entities (vehicles, persons of interest).
- **Alerts**: Automated alerting when YOLO detections match active watchlists.
- **Vehicle Movement History**: Geospatial trail tracking for historical event analysis.
- **VMS Federation**: Seamless integration capabilities with third-party video management systems.

## 4. Architecture Overview
The system employs a multi-tiered architecture:
- **Frontend**: React (Vite) + Tailwind CSS, Leaflet for GIS.
- **Backend API**: FastAPI for rapid, asynchronous REST APIs.
- **Analytics Worker**: OpenCV for stream decoding + YOLO11n for ML inference.
- **Database**: PostgreSQL with PostGIS extension for spatial querying.
*(See `docs/ARCHITECTURE.md` for a detailed breakdown).*

## 5. Technology Stack
- **Frontend**: React 18, Vite, TailwindCSS, React-Router, Lucide Icons, React-Leaflet.
- **Backend**: Python 3, FastAPI, SQLAlchemy, GeoAlchemy2, Alembic, Uvicorn.
- **AI / Computer Vision**: Ultralytics (YOLO11n), OpenCV-Python.
- **Database**: PostgreSQL + PostGIS.

## 6. Repository Structure
```
├── backend/                  # FastAPI Backend
│   ├── alembic/              # Database Migrations
│   ├── routers/              # API Endpoints
│   ├── services/             # Analytics and VMS Business Logic
│   ├── main.py               # Application Entrypoint
│   ├── models.py             # SQLAlchemy Models
│   ├── schemas.py            # Pydantic Schemas
│   └── seed_*.py             # Demo Seeding Scripts
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI Components
│   │   ├── pages/            # View Controllers (Dashboard, Monitoring, etc.)
│   │   └── services/         # API Helpers
│   └── package.json
└── docs/                     # Documentation files
```

## 7. Setup Instructions
### Environment Variables
Create a `.env` file in the `backend/` directory. 
**IMPORTANT**: Never commit real credentials to version control.
```env
SENTINEL_EMAIL=<your-email>
SENTINEL_PASSWORD=<your-password>
DATABASE_URL=postgresql://<user>:<password>@localhost/cctv_db
```

### How to run Database/PostGIS
Ensure PostgreSQL is installed with the PostGIS extension enabled.
```sql
CREATE DATABASE cctv_db;
\c cctv_db
CREATE EXTENSION postgis;
```

### How to run Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (or venv\Scripts\activate on Windows)
pip install -r requirements.txt
alembic upgrade head
python seed_watchlist.py
python seed_events.py
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### How to run Frontend
```bash
cd frontend
npm install
npm run dev
```

## 8. API Overview
- `GET /api/cameras`: Retrieve the full CCTV registry.
- `GET /api/analytics/status`: Poll current active background workers.
- `GET /api/analytics/stream/{id}`: Fetch MJPEG stream for a camera.
- `GET/POST /api/watchlist`: Manage entities.
- `GET /api/alerts`: Retrieve detection matches.
- `GET /api/events`: Retrieve chronological detection events.

## 9. Demo Workflow
Please reference `docs/DEMO_GUIDE.md` for a step-by-step 5-minute presentation guide.

## 10. Current Limitations
- **Current Demonstration**: 30 Sentinel cameras.
- **Matching Accuracy**: Current alerts utilize synthetic matching against standard YOLO classes (e.g., matching a generic "car" or "person" class bounding box). Real license plate recognition (ANPR) or facial recognition is not yet integrated into this MVP.
- **Movement History**: The vehicle tracking trail relies on synthetic ID data to demonstrate the UI tracking infrastructure.

## 11. Future Enhancements
- Integration of specialized LPR and Face-ReID pipelines.
- Implementation of Kafka/RabbitMQ for distributed event streaming.
- Kubernetes deployment for elastic analytics scaling.
- Regional edge-computing nodes for bandwidth reduction.

## 12. Security Features
- **Backend-only Credentials**: All Sentinel RTSP credentials and API keys remain strictly backend-side.
- **Hidden RTSP**: Authenticated RTSP URLs are never exposed to the React frontend.
- **Environment Management**: `.env` files manage configurations, and secrets are excluded from version control.
- **Data Truthfulness**: Synthetic/Demo datasets (such as simulated movement trails) are explicitly tagged in the UI.
