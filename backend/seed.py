import os
import sys

# Add parent directory to path to allow importing from backend modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import Camera, ProtocolEnum, StatusEnum

def seed_data():
    db = SessionLocal()
    try:
        # Clear existing data for a fresh seed
        db.query(Camera).delete()
        
        print("Seeding 30 Sentinel CCTV cameras for development...")
        
        cameras = [
            {"code": "cam01", "name": "01 Chiman bhai Bridge"},
            {"code": "cam02", "name": "02 Janpath"},
            {"code": "cam03", "name": "03 O.N.G.C. Office"},
            {"code": "cam04", "name": "04 Paldi Circle"},
            {"code": "cam05", "name": "05 Visat teen Rasta"},
            {"code": "cam06", "name": "06 Timbavadi gate-Junagadh"},
            {"code": "cam07", "name": "07 hero-showroom-gir-somnath"},
            {"code": "cam08", "name": "08 majewadi-gate-junagadh"},
            {"code": "cam09", "name": "09 new-bypass-near-by-circle-junagadh-2"},
            {"code": "cam10", "name": "10 char-chowk-road-2-junagadh"},
            {"code": "cam11", "name": "11 dolatpara-junagadh"},
            {"code": "cam12", "name": "12 Tri Mandir Adalaj Tollnaka"},
            {"code": "cam13", "name": "13 CN Vidhyalaya"},
            {"code": "cam14", "name": "14 Delight RLVD"},
            {"code": "cam15", "name": "15 Suvidha park"},
            {"code": "cam16", "name": "16 Visat P2"},
            {"code": "cam17", "name": "17 Rajkot Bus Port CCTV"},
            {"code": "cam18", "name": "18 Rajkot CCTV"},
            {"code": "cam19", "name": "19 KHAPARIA GRAM PANCHAYAT, TALUKA GANDEVI, DISTRICT NAVSARI"},
            {"code": "cam20", "name": "20 Mohanpura"},
            {"code": "cam21", "name": "23 Patan Dethali Char Rasta"},
            {"code": "cam22", "name": "28 BK Mervada tran Rasta"},
            {"code": "cam23", "name": "30 kheram"},
            {"code": "cam24", "name": "33 dehgam"},
            {"code": "cam25", "name": "34 dhanori"},
            {"code": "cam26", "name": "35 TANKAL"},
            {"code": "cam27", "name": "36 bilimora"},
            {"code": "cam28", "name": "37 bilimora"},
            {"code": "cam29", "name": "38 bilimora"},
            {"code": "cam30", "name": "Gandhidham Rambaugh p2"}
        ]
        
        for c in cameras:
            cam_data = {
                "camera_code": c["code"],
                "camera_name": c["name"],
                "department": "Gujarat Sentinel",
                "location_name": c["name"],
                "latitude": 23.0383,
                "longitude": 72.5119,
                "stream_url": f"rtsp://protected-stream/stream/{c['code']}",
                "protocol": ProtocolEnum.RTSP,
                "status": StatusEnum.ACTIVE,
            }
            # Create PostGIS POINT from lat/lon
            geom_wkt = f"POINT({cam_data['longitude']} {cam_data['latitude']})"
            new_camera = Camera(**cam_data, geom=geom_wkt)
            db.add(new_camera)
        
        db.commit()
        print("Successfully seeded 30 Sentinel test cameras!")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if os.getenv("ENVIRONMENT", "development") != "development":
        print("Seed script can only be run in development environment.")
        sys.exit(1)
    seed_data()
