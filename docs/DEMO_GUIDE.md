# 5-Minute Demonstration Guide

This guide provides a standardized, chronological flow for presenting the MVP to hackathon judges. 

## Preparation
Ensure the backend API, frontend React server, and PostgreSQL database are all running smoothly.
Ensure the Dashboard correctly states "30 Total Cameras".

## Step 1: The Dashboard (0:00 - 1:00)
1. Navigate to `/`.
2. **Talking Point**: Point out the "System Demo Status" banner highlighting the completed objectives. 
3. Briefly mention the Summary Cards polling live from the backend API.
4. **Action**: Click the **Live Monitoring** Quick Action.

## Step 2: Live Monitoring & Analytics (1:00 - 2:00)
1. The 30-camera Sentinel registry will render into a grid. 
2. **Action**: Locate and select **CAM01** (or click "Select All" if demonstrating backend load capacity, though picking one is safer for video clarity).
3. **Action**: Click **Start Analytics** in the right-hand panel.
4. **Talking Point**: Explain that a background Python worker is now securely authenticating with the Sentinel RTSP stream, decoding TCP packets, and spinning up YOLO11n.
5. **Action**: Wait for the Stream Preview to change from "CONNECTING" to "LIVE". Show the real-time MJPEG feed and point out the bounding boxes actively detecting vehicles.

## Step 3: Alerts & Watchlist (2:00 - 3:00)
1. **Talking Point**: Explain how raw detections become actionable intelligence.
2. **Action**: Open the **Watchlist** page. Show the pre-seeded entities. Highlight that they are labelled as synthetic descriptors (e.g., "Red sedan").
3. **Action**: Open the **Alerts** page. 
4. **Talking Point**: Show the historical alerts generated from CAM01 intersecting with the Watchlist parameters. Explicitly note the truthfulness rule: *“These are synthetic demonstrations of the architectural pipeline. True re-identification requires ANPR, which would drop seamlessly into this exact data structure.”*

## Step 4: Geospatial Tracking (3:00 - 4:00)
1. **Action**: Navigate to **Vehicle Tracking**.
2. **Action**: Leave the default `DEMO-VEH-001` in the search bar and click **Track**.
3. **Talking Point**: Direct attention to the Leaflet map. 
4. Explain how detection events are piped into PostGIS. Show the chronological blue dotted line plotting the vehicle's historical path across the state's camera infrastructure. 
5. Point out the "DEMO DATA" labels to maintain hackathon compliance.

## Step 5: GIS Map & Scalability (4:00 - 5:00)
1. **Action**: Navigate back to the **Dashboard** and scroll down to the **Live GIS Map**.
2. **Action**: Open the **VMS Federation** page to briefly demonstrate readiness for 3rd party integration.
3. **Conclusion**: Conclude by referencing the `docs/SCALABILITY.md` document. Reiterate that while this MVP safely processes real RTSP video and AI pipelines locally, the architecture is specifically modeled to cleanly transition into a Kafka-driven, Edge-processed microservice topology to reach the 80,000-camera mandate.
