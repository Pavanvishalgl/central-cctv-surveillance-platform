from database import SessionLocal
from models import DetectionEvent, Camera
import datetime

def seed():
    db = SessionLocal()
    
    db.query(DetectionEvent).delete()
    db.commit()

    print("Seeding Demo Events...")
    
    cameras = db.query(Camera).order_by(Camera.id).limit(5).all()
    if not cameras:
        print("No cameras found to seed.")
        return
        
    events = []
    
    # Path for DEMO-VEH-001
    base_time = datetime.datetime.now() - datetime.timedelta(hours=2)
    for i, cam in enumerate(cameras):
        events.append(
            DetectionEvent(
                camera_id=cam.id,
                vehicle_id="DEMO-VEH-001",
                detection_class="car",
                confidence=0.88 + (i * 0.01),
                timestamp=base_time + datetime.timedelta(minutes=i*15),
                latitude=cam.latitude,
                longitude=cam.longitude,
                source="DEMO",
                is_demo=True
            )
        )
        
    # Path for DEMO-VEH-002
    base_time2 = datetime.datetime.now() - datetime.timedelta(hours=1)
    for i, cam in enumerate(reversed(cameras[:3])):
        events.append(
            DetectionEvent(
                camera_id=cam.id,
                vehicle_id="DEMO-VEH-002",
                detection_class="truck",
                confidence=0.92,
                timestamp=base_time2 + datetime.timedelta(minutes=i*10),
                latitude=cam.latitude,
                longitude=cam.longitude,
                source="DEMO",
                is_demo=True
            )
        )

    db.add_all(events)
    db.commit()

    print("Seed complete.")
    db.close()

if __name__ == "__main__":
    seed()
