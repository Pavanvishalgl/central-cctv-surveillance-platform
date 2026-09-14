# Scalability Roadmap: 30 to 80,000 Cameras

**Current Demonstration:** 30 Sentinel cameras.

The MVP relies on local multi-threading and an in-memory application state for video ingestion. To successfully and reliably scale to an infrastructure of 80,000 interconnected cameras across the state of Gujarat, the architecture must transition from a monolithic prototype to a fully distributed, event-driven topology. 

## 1. Regional Ingestion Gateways
Ingesting 80,000 RTSP streams simultaneously in a central datacenter would obliterate inbound bandwidth limits. 
- **Topology**: Establish regional edge ingestion gateways grouped geographically. 
- **Function**: These gateways handle the raw TCP handshake and stream decoding locally.

## 2. Selective AI Processing
Running real-time 30-fps computer vision on 80,000 streams implies 2.4 million frames per second.
- **Rule-Based Triggers**: AI pipelines should only spin up upon external triggers (e.g., motion detection sensors, scheduled operational hours, or explicit operator requests).
- **Time-Division Multiplexing**: Instead of processing every frame, the system samples 1 frame per second (or lower) for standard surveillance, dramatically reducing GPU overhead.

## 3. Distributed Analytics Workers & GPU Slicing
- **Orchestration**: Transition to Kubernetes (K8s). Analytics tasks are deployed as isolated, stateless pods.
- **Hardware**: Leverage Nvidia Multi-Instance GPU (MIG) to securely partition physical GPUs into multiple isolated instances, ensuring parallel inference jobs don't bottleneck each other.

## 4. Message / Event Bus
The current MVP directly links the YOLO worker to the PostgreSQL database. At scale, write-contention would crash the database.
- **Implementation**: Introduce Apache Kafka or RabbitMQ.
- **Flow**: Workers push JSON detection payloads to a `detections` Kafka topic. Dedicated highly optimized consumers batch-insert these records into the database asynchronously.

## 5. PostgreSQL / PostGIS Partitioning
A table tracking detection events for 80,000 cameras will accumulate billions of rows a week.
- **Partitioning**: PostgreSQL tables must be partitioned by `range` (e.g., partitioned monthly or weekly by `created_at` timestamp).
- **Read Replicas**: Separate heavy GIS read queries (from the frontend map) to dedicated read-replicas, isolating them from the high-velocity ingestion writes.

## 6. Object / Event Storage
- High-resolution snapshot crops of Watchlist matches should be pushed directly to S3-compatible blob storage.
- The PostgreSQL `Alerts` table will simply retain the URL pointer to the blob rather than storing Base64 binaries, ensuring DB leanness.

## 7. High Availability & Regional Failover
- **Load Balancing**: Deploy HAProxy or NGINX ingress controllers to route UI traffic.
- **Failover**: If a regional edge ingestion node drops, an adjacent regional node automatically attempts to re-establish the RTSP handshakes for the disconnected cameras.

## 8. Observability
- Integrating Prometheus and Grafana to actively monitor GPU utilization, pipeline latency, dead streams, and VMS API limits in real-time.
