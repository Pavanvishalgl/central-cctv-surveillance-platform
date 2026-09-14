import os
import cv2
from urllib.parse import quote
from dotenv import load_dotenv

load_dotenv()

email = os.getenv("SENTINEL_EMAIL")
password = os.getenv("SENTINEL_PASSWORD")

if not email or not password:
    print("ERROR: Sentinel credentials not found in .env")
    raise SystemExit(1)

email_encoded = quote(email, safe="")
password_encoded = quote(password, safe="")

url = (
    f"rtsp://{email_encoded}:{password_encoded}"
    f"@103.250.160.189:8554/stream/cam01"
)

os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"

print("Connecting to Sentinel CAM01 via RTSP/TCP...")

cap = cv2.VideoCapture(url, cv2.CAP_FFMPEG)

if not cap.isOpened():
    print("FAILED: Could not open CAM01 RTSP stream")
    raise SystemExit(1)

print("SUCCESS: CAM01 RTSP stream opened")

for i in range(10):
    ok, frame = cap.read()

    if not ok:
        print(f"Frame {i}: FAILED")
        break

    pts = cap.get(cv2.CAP_PROP_POS_MSEC)

    print(
        f"Frame {i}: "
        f"{frame.shape[1]}x{frame.shape[0]} "
        f"PTS={pts:.2f} ms"
    )

cap.release()
print("DONE")