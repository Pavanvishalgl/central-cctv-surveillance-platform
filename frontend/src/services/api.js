export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const getCameras = async () => {
    const res = await fetch(`${API_URL}/api/cameras`);
    if (!res.ok) throw new Error("Failed to fetch cameras");
    return res.json();
};

export const createCamera = async (data) => {
    const res = await fetch(`${API_URL}/api/cameras`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create camera");
    }
    return res.json();
};

export const updateCamera = async (id, data) => {
    const res = await fetch(`${API_URL}/api/cameras/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update camera");
    return res.json();
};

export const deleteCamera = async (id) => {
    const res = await fetch(`${API_URL}/api/cameras/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete camera");
    return true;
};

// Analytics endpoints
export const getAnalyticsStatus = async () => {
    const res = await fetch(`${API_URL}/api/analytics/status`);
    if (!res.ok) throw new Error("Failed to fetch analytics status");
    return res.json();
};

export const startAnalytics = async (cameraIds) => {
    const res = await fetch(`${API_URL}/api/analytics/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ camera_ids: cameraIds })
    });
    if (!res.ok) throw new Error("Failed to start analytics");
    return res.json();
};

export const stopAnalytics = async (cameraIds) => {
    const res = await fetch(`${API_URL}/api/analytics/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ camera_ids: cameraIds })
    });
    if (!res.ok) throw new Error("Failed to stop analytics");
    return res.json();
};

// VMS Federation endpoints
export const getVMSList = async () => {
    const res = await fetch(`${API_URL}/api/vms`);
    if (!res.ok) throw new Error("Failed to fetch VMS list");
    return res.json();
};

export const registerVMS = async (data) => {
    const res = await fetch(`${API_URL}/api/vms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to register VMS");
    return res.json();
};

export const connectVMS = async (id) => {
    const res = await fetch(`${API_URL}/api/vms/${id}/connect`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to connect VMS");
    return res.json();
};

export const disconnectVMS = async (id) => {
    const res = await fetch(`${API_URL}/api/vms/${id}/disconnect`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to disconnect VMS");
    return res.json();
};

export const getVMSCameras = async (id) => {
    const res = await fetch(`${API_URL}/api/vms/${id}/cameras`);
    if (!res.ok) throw new Error("Failed to fetch federated cameras");
    return res.json();
};

export const getEvents = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/api/events?${query}`);
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
};

export const getVehicleHistory = async (vehicleId) => {
    const res = await fetch(`${API_URL}/api/events/vehicle/${vehicleId}`);
    if (!res.ok) throw new Error("Failed to fetch vehicle history");
    return res.json();
};
