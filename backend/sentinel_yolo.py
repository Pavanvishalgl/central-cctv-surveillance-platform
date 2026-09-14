import os
import cv2
from urllib.parse import quote
from dotenv import load_dotenv
from ultralytics import YOLO

load_dotenv()

email = os.getenv("SENTINEL_EMAIL")
password = os.getenv("SENTINEL_PASSWORD")

if not email or not password:
    print("ERROR: Sentinel credentials not found")
    raise SystemExit(1)

email = quote(email, safe="")
password = quote(password, safe="")

rtsp_url = (
    f"rtsp://{email}:{password}"
    f"@103.250.160.189:8554/stream/cam01"
)

os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"

print("Loading YOLO model...")
model = YOLO("yolo11n.pt")

print("Connecting to Sentinel CAM01...")
cap = cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)

if not cap.isOpened():
    print("ERROR: Could not open CAM01")
    raise SystemExit(1)

print("LIVE AI ANALYTICS STARTED")
print("Press Ctrl+C to stop\n")

frame_count = 0

try:
    while True:
        ok, frame = cap.read()

        if not ok:
            print("Frame read failed")
            break

        frame_count += 1

        # Process every 3rd frame to reduce CPU load
        if frame_count % 3 != 0:
            continue

        pts_ms = cap.get(cv2.CAP_PROP_POS_MSEC)

        results = model(
            frame,
            conf=0.4,
            verbose=False
        )

        detections = []

        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                class_name = model.names[class_id]

                detections.append(
                    (class_name, confidence)
                )

        print(
            f"PTS={pts_ms:.0f} ms | "
            f"Detections={len(detections)} | "
            f"{detections}"
        )

except KeyboardInterrupt:
    print("\nStopping AI analytics...")

finally:
    cap.release()
    print("CAM01 released")