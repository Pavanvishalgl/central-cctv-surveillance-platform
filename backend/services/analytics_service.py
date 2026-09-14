import os
import cv2
import time
import threading
from urllib.parse import quote
from dotenv import load_dotenv
from ultralytics import YOLO

load_dotenv()

# In-memory store for active analytics sessions (camera_id -> status dict)
_active_sessions = {}
_workers = {}
_stop_events = {}
_latest_frames = {}

_active_watchlist = []
_last_alert_time = {}

def refresh_watchlist(db):
    global _active_watchlist
    from models import Watchlist, StatusEnum
    _active_watchlist = [
        {"id": w.id, "type": w.type.value, "identifier": w.identifier}
        for w in db.query(Watchlist).filter(Watchlist.status == StatusEnum.ACTIVE).all()
    ]

print("Loading YOLO model...")
try:
    _yolo_model = YOLO("yolo11n.pt")
except Exception as e:
    print(f"Failed to load YOLO model: {e}")
    _yolo_model = None

def _analytics_worker(camera_id: int, sentinel_cam_id: str, stop_event: threading.Event):
    email = os.getenv("SENTINEL_EMAIL")
    password = os.getenv("SENTINEL_PASSWORD")
    
    if not email or not password:
        _active_sessions[camera_id] = {"status": "ERROR", "error": "Credentials missing"}
        return
        
    email = quote(email, safe="")
    password = quote(password, safe="")
    
    rtsp_url = (
        f"rtsp://{email}:{password}"
        f"@103.250.160.189:8554/stream/{sentinel_cam_id}"
    )
    
    os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"
    
    reconnect_delay = 2
    
    while not stop_event.is_set():
        _active_sessions[camera_id]["status"] = "CONNECTING"
        cap = cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)
        
        if not cap.isOpened():
            _active_sessions[camera_id]["status"] = "ERROR"
            _active_sessions[camera_id]["error"] = "Connection failed"
            for _ in range(reconnect_delay):
                if stop_event.is_set():
                    break
                time.sleep(1)
            reconnect_delay = min(reconnect_delay * 2, 30)
            continue
            
        reconnect_delay = 2
        _active_sessions[camera_id]["status"] = "ACTIVE"
        _active_sessions[camera_id]["error"] = None
        frame_count = 0
        
        try:
            while not stop_event.is_set():
                ok, frame = cap.read()
                if not ok:
                    break
                    
                frame_count += 1
                if frame_count % 3 != 0:
                    continue
                    
                pts_ms = cap.get(cv2.CAP_PROP_POS_MSEC)
                
                detections = []
                if _yolo_model is not None:
                    results = _yolo_model(frame, conf=0.4, verbose=False)
                    for result in results:
                        for box in result.boxes:
                            class_id = int(box.cls[0])
                            confidence = float(box.conf[0])
                            class_name = _yolo_model.names[class_id]
                            detections.append({"class": class_name, "confidence": confidence})
                            
                            # Check Watchlist match
                            global _active_watchlist
                            for w in _active_watchlist:
                                if w["identifier"].lower() == class_name.lower() or w["identifier"].lower() in class_name.lower():
                                    alert_key = (camera_id, w["id"])
                                    # 30 seconds debounce per watchlist-camera pair
                                    if time.time() - _last_alert_time.get(alert_key, 0) > 30:
                                        _last_alert_time[alert_key] = time.time()
                                        try:
                                            from database import SessionLocal
                                            from models import Alert
                                            db = SessionLocal()
                                            new_alert = Alert(
                                                camera_id=camera_id,
                                                watchlist_id=w["id"],
                                                detection_class=class_name,
                                                confidence=confidence,
                                                status="NEW"
                                            )
                                            db.add(new_alert)
                                            db.commit()
                                            db.close()
                                        except Exception as e:
                                            print(f"Alert creation failed: {e}")

                            # Draw bounding box on frame for preview
                            x1, y1, x2, y2 = map(int, box.xyxy[0])
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                            cv2.putText(frame, f"{class_name} {confidence:.2f}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                
                # Encode frame to JPEG for browser preview
                ret, buffer = cv2.imencode('.jpg', frame)
                if ret:
                    _latest_frames[camera_id] = buffer.tobytes()
                
                _active_sessions[camera_id].update({
                    "PTS": pts_ms,
                    "detection_count": len(detections),
                    "detections": detections,
                    "last_update": time.time(),
                    "tasks": ["vehicle_detection", "anpr"]
                })
                
        except Exception as e:
            _active_sessions[camera_id]["status"] = "ERROR"
            _active_sessions[camera_id]["error"] = str(e)
        finally:
            cap.release()
            
        if not stop_event.is_set():
            time.sleep(1)

def start_analytics(camera_ids: list[int], cam_mapping: dict = None):
    try:
        from database import SessionLocal
        db = SessionLocal()
        refresh_watchlist(db)
        db.close()
    except Exception as e:
        print(f"Failed to refresh watchlist: {e}")

    started = []
    for cid in camera_ids:
        if cid not in _active_sessions:
            _active_sessions[cid] = {
                "status": "STARTING",
                "tasks": ["vehicle_detection", "anpr"],
                "PTS": 0,
                "detection_count": 0,
                "detections": [],
                "last_update": time.time()
            }
            stop_event = threading.Event()
            _stop_events[cid] = stop_event
            sentinel_cam_id = cam_mapping.get(cid, f"cam{cid:02d}") if cam_mapping else f"cam{cid:02d}"
            thread = threading.Thread(target=_analytics_worker, args=(cid, sentinel_cam_id, stop_event), daemon=True)
            _workers[cid] = thread
            thread.start()
            started.append(cid)
    return started

def stop_analytics(camera_ids: list[int]):
    stopped = []
    for cid in camera_ids:
        if cid in _active_sessions:
            if cid in _stop_events:
                _stop_events[cid].set()
            if cid in _workers:
                # Optionally wait for thread to finish
                pass
            del _active_sessions[cid]
            if cid in _stop_events:
                del _stop_events[cid]
            if cid in _workers:
                del _workers[cid]
            stopped.append(cid)
    return stopped

def get_active_sessions():
    return _active_sessions

def get_stream(camera_id: int):
    # Generator for MJPEG streaming
    while True:
        if camera_id in _stop_events and _stop_events[camera_id].is_set():
            break
        if camera_id in _latest_frames:
            frame = _latest_frames[camera_id]
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        time.sleep(0.1)

