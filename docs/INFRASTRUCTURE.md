# Infrastructure Sizing & Capacity Planning

This document outlines a conceptual sizing approach for a large-scale deployment. 

**IMPORTANT**: 
*All numbers below are theoretical planning assumptions for an 80,000-camera system and do NOT represent measured benchmarks of the current MVP.*

## 1. Network Architecture & Ingestion Bandwidth
*Planning Assumption: 80,000 cameras at 1080p, H.264 compression, roughly 2 Mbps per stream.*
- **Total Raw Inbound**: 80,000 * 2 Mbps = 160 Gbps.
- **Architecture**: A single centralized inbound pipe of 160 Gbps is commercially unviable. The network must be decentralized into 10-20 regional edge nodes (e.g., handling 4,000 to 8,000 cameras each, requiring 8-16 Gbps inbound lines respectively).

## 2. AI GPU Capacity
*Planning Assumption: Batch processing YOLO at 1 Frame-Per-Second (FPS) per camera.*
- A modern datacenter GPU (e.g., NVIDIA A100 or H100) can inference approximately 1,000 to 1,500 FPS for lightweight models like YOLO11n if heavily optimized with TensorRT.
- For 80,000 cameras (80,000 FPS), the system would require an estimated **50 to 80 high-tier GPUs** running continuously.
- *Optimization*: Activating AI only on 10% of cameras at any given time (selective analytics) drops this requirement to just **5 to 8 GPUs**.

## 3. CPU & RAM Capacity
- **Stream Decoding**: FFMPEG decoding of H.264/H.265 streams is CPU intensive. 
- *Planning Assumption*: 1 modern CPU core per 5-10 streams. 80,000 streams require roughly **8,000 to 16,000 vCPUs** across the cluster.
- **RAM**: In-memory frame buffers require approximately 50-100MB per active stream. Total distributed memory footprint roughly **4TB to 8TB**.

## 4. Database Capacity & Storage
*Planning Assumption: Logging 1 detection event per second across 10% of cameras.*
- **Velocity**: 8,000 events/second. 691 Million rows per day.
- **Storage**: At roughly 200 bytes per row, the PostgreSQL event index will grow by ~138 GB daily.
- **Object Storage (Snapshots)**: If 1% of events trigger a 100KB JPEG snapshot crop, blob storage grows by ~690 GB daily.
- **Total Storage Array**: Expect to provision ~25 TB of NVMe flash storage per month.

## 5. Retention Policy
To prevent cascading storage overflow, cold-tiering is mandatory.
- **Hot Tier (NVMe/SSD)**: Last 7 days of raw movement history and alerts (PostgreSQL).
- **Warm Tier (HDD/S3 Standard)**: Last 30 days of summarized metadata and visual snapshot evidence.
- **Cold Tier (S3 Glacier/Tape)**: Compliance archives (1-5 years).

## 6. High Availability & Disaster Recovery
- **Active-Active Load Balancing**: Frontend UI and API gateways replicated across two distinct availability zones (AZs).
- **Database Failover**: PostgreSQL configured with synchronous streaming replication to a hot standby.
- **Disaster Recovery (DR)**: Daily automated snapshots of the CCTV Registry and Watchlist tables exported to isolated immutable off-site storage. Detection events are treated as ephemeral and optionally recovered based on cost constraints.
