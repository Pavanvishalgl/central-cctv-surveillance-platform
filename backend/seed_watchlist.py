from database import SessionLocal
from models import Watchlist, Alert, WatchlistTypeEnum, StatusEnum
import datetime

def seed():
    db = SessionLocal()
    
    # Delete existing
    db.query(Alert).delete()
    db.query(Watchlist).delete()
    db.commit()

    print("Seeding Watchlist...")
    watchlists = [
        Watchlist(type=WatchlistTypeEnum.STOLEN_VEHICLE, identifier="car", name="DEMO-VEH-001", description="Red sedan reported stolen"),
        Watchlist(type=WatchlistTypeEnum.BLACKLISTED_VEHICLE, identifier="truck", name="DEMO-VEH-002", description="Blacklisted heavy vehicle"),
        Watchlist(type=WatchlistTypeEnum.WANTED_PERSON, identifier="person", name="DEMO-PERSON-001", description="Wanted suspect in robbery"),
        Watchlist(type=WatchlistTypeEnum.MISSING_PERSON, identifier="person", name="DEMO-PERSON-002", description="Missing child"),
        Watchlist(type=WatchlistTypeEnum.SUSPECT, identifier="bus", name="DEMO-VEH-003", description="Suspect vehicle"),
    ]
    db.add_all(watchlists)
    db.commit()

    print("Seeding Alerts...")
    wl_car = db.query(Watchlist).filter(Watchlist.identifier == "car").first()
    wl_person = db.query(Watchlist).filter(Watchlist.identifier == "person").first()
    
    alerts = [
        Alert(camera_id=7, watchlist_id=wl_car.id, detection_class="car", confidence=0.89, message="DEMO: Matched vehicle classification", timestamp=datetime.datetime.now() - datetime.timedelta(minutes=10)),
        Alert(camera_id=7, watchlist_id=wl_person.id, detection_class="person", confidence=0.92, message="DEMO: Matched person classification", timestamp=datetime.datetime.now() - datetime.timedelta(minutes=5)),
    ]
    db.add_all(alerts)
    db.commit()

    print("Seed complete.")
    db.close()

if __name__ == "__main__":
    seed()
