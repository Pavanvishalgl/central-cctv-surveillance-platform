import requests
import time

BASE_URL = "http://localhost:8000/api/vms"

def test_vms_federation():
    print("--- Starting VMS Federation Tests ---")

    # 1. Register Mock VMS A
    print("\n1. Registering Vendor A VMS...")
    res = requests.post(BASE_URL, json={
        "name": "Vendor A Central Server",
        "vendor": "Mock",
        "host": "vms-a.local"
    })
    vms_a = res.json()
    print(f"Registered: {vms_a}")
    vms_a_id = vms_a['id']

    # 2. Register Mock VMS B
    print("\n2. Registering Vendor B VMS...")
    res = requests.post(BASE_URL, json={
        "name": "Vendor B Edge System",
        "vendor": "Mock",
        "host": "vms-b.local"
    })
    vms_b = res.json()
    print(f"Registered: {vms_b}")
    vms_b_id = vms_b['id']

    # 3. List all VMS
    print("\n3. Listing all registered VMS...")
    res = requests.get(BASE_URL)
    print(f"Total VMS registered: {len(res.json())}")

    # 4. Connect to VMS A
    print("\n4. Connecting to Vendor A VMS...")
    res = requests.post(f"{BASE_URL}/{vms_a_id}/connect")
    print(f"Connect Response: {res.json()}")

    # 5. Fetch cameras from VMS A
    print("\n5. Fetching federated cameras from Vendor A VMS...")
    res = requests.get(f"{BASE_URL}/{vms_a_id}/cameras")
    cameras = res.json()
    print(f"Retrieved {len(cameras)} cameras.")
    for cam in cameras:
        print(f"  - {cam['camera_code']}: {cam['camera_name']}")

    # 6. Try fetching cameras from VMS B (Should fail, not connected)
    print("\n6. Attempting to fetch cameras from Vendor B (should fail)...")
    res = requests.get(f"{BASE_URL}/{vms_b_id}/cameras")
    print(f"Response: {res.status_code} - {res.json()}")

    # 7. Disconnect VMS A
    print("\n7. Disconnecting from Vendor A...")
    res = requests.post(f"{BASE_URL}/{vms_a_id}/disconnect")
    print(f"Disconnect Response: {res.json()}")

    print("\n--- All VMS Federation Tests Complete ---")

if __name__ == "__main__":
    test_vms_federation()
