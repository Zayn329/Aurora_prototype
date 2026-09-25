"""
ARORA Polar Expedition Command Platform
Bharati Research Station — Synthetic Demonstration Dataset Generator
Produces a connected, unified operational state across Environment, Routes, Missions,
Personnel, Assets, Logistics, Alerts, and AI Recommendations.
"""

import json
import os
from datetime import datetime, timedelta, timezone

def generate_dataset():
    base_time = datetime(2026, 9, 25, 10, 0, 0, tzinfo=timezone.utc)

    # 1. Mission Overview & Station Metadata
    overview = {
        "dataset_label": "Bharati Research Station",
        "mission_name": "Antarctic Coastal Research & Logistics Expedition",
        "mission_id": "ANT-026",
        "region": "Eastern Antarctica (Larsemann Hills Sector)",
        "primary_station": "Bharati Research Station",
        "coordinates": "69°24'28\"S, 76°11'14\"E",
        "elevation_m": 35,
        "mission_status": "Active",
        "mission_progress_percent": 64,
        "kpis": {
            "active_missions": 4,
            "planned_missions": 3,
            "completed_missions": 8,
            "personnel_deployed": 46,
            "operational_assets": 17,
            "cargo_items": 38,
            "active_routes": 9,
            "operational_zones": 12,
            "active_alerts": 6,
            "open_incidents": 2
        }
    }

    # 2. Missions List
    missions = [
        {
            "id": "ANT-026",
            "name": "Coastal Research Expedition",
            "region": "Bharati Sector",
            "team_size": 18,
            "status": "Active",
            "risk": "Medium",
            "priority": "P2_HIGH",
            "lead": "Dr. Sunita Rao (P-001)",
            "start_time": (base_time - timedelta(days=12)).isoformat(),
            "target_completion": (base_time + timedelta(days=8)).isoformat(),
            "progress_percent": 64,
            "objective": "High-resolution coastal bathymetry, marine biodiversity monitoring, and automated sensor deployment."
        },
        {
            "id": "ANT-027",
            "name": "Ice Shelf Survey",
            "region": "East Antarctica (Amery / Polar Plateau)",
            "team_size": 11,
            "status": "Active",
            "risk": "High",
            "priority": "P1_CRITICAL",
            "lead": "Dr. Ravi Nair (P-011)",
            "start_time": (base_time - timedelta(days=4)).isoformat(),
            "target_completion": (base_time + timedelta(days=6)).isoformat(),
            "progress_percent": 42,
            "objective": "Deep-ice radar sounding and seismic telemetry across crevassed shelf edge.",
            "impact_status": "IMPACTED",
            "impact_reason": "Route R-03 weather deterioration, wind spike to 47 km/h, visibility drop to 5.4 km. SV-03 halted."
        },
        {
            "id": "ANT-028",
            "name": "Supply Resupply Run",
            "region": "Coastal Sector",
            "team_size": 9,
            "status": "Planned",
            "risk": "Medium",
            "priority": "P2_HIGH",
            "lead": "Kiran Patel (P-004)",
            "start_time": (base_time + timedelta(days=2)).isoformat(),
            "target_completion": (base_time + timedelta(days=4)).isoformat(),
            "progress_percent": 10,
            "objective": "Overland transport of fuel tanker FT-02 and rations from Coastal Port to Bharati Depot."
        },
        {
            "id": "ANT-029",
            "name": "Atmospheric Research",
            "region": "Inland Sector",
            "team_size": 8,
            "status": "Active",
            "risk": "Low",
            "priority": "P3_MEDIUM",
            "lead": "Dr. Meera Sen (P-007)",
            "start_time": (base_time - timedelta(days=6)).isoformat(),
            "target_completion": (base_time + timedelta(days=14)).isoformat(),
            "progress_percent": 55,
            "objective": "High-altitude meteorological sounding balloons and ozone profile measurements."
        },
        {
            "id": "ANT-030",
            "name": "Station Maintenance",
            "region": "Bharati Sector",
            "team_size": 12,
            "status": "Planned",
            "risk": "Low",
            "priority": "P3_MEDIUM",
            "lead": "Arun Verma (P-009)",
            "start_time": (base_time + timedelta(days=3)).isoformat(),
            "target_completion": (base_time + timedelta(days=7)).isoformat(),
            "progress_percent": 0,
            "objective": "Preventative overhaul on backup diesel turbine GEN-04 and satellite comms dome."
        },
        {
            "id": "ANT-031",
            "name": "Emergency Support",
            "region": "Coastal Sector",
            "team_size": 6,
            "status": "Standby",
            "risk": "High",
            "priority": "P1_CRITICAL",
            "lead": "Vikram Seth (P-005)",
            "start_time": base_time.isoformat(),
            "target_completion": (base_time + timedelta(days=30)).isoformat(),
            "progress_percent": 100,
            "objective": "Standby polar rescue, heavy winch extraction, and medical evacuation."
        }
    ]

    # Completed Missions (8 Completed)
    completed_missions = [
        {"id": f"ANT-{i:03d}", "name": name, "status": "Completed", "completion_date": (base_time - timedelta(days=30-i)).strftime("%Y-%m-%d")}
        for i, name in enumerate([
            "Pre-Season Habitat Pressure Test",
            "Harbor Ice Reconnaissance",
            "Early Fuel Depot Delivery",
            "Primary Comms Link Calibration",
            "Summer Science Staging",
            "Permafrost Temperature Coring",
            "Coastal Seismic Baseline",
            "Airstrip Winterization Check"
        ], start=18)
    ]
    missions.extend(completed_missions)

    # 3. Personnel (Exactly 46 records: P-001 to P-046)
    roles_pool = [
        ("Mission Commander", "Alpha", "Bharati Command", "Active", "ANT-026"),
        ("Field Researcher", "Alpha", "Coastal Zone", "Active", "ANT-026"),
        ("Glaciologist", "Alpha", "Coastal Zone", "Active", "ANT-026"),
        ("Logistics Officer", "Alpha", "Bharati Depot", "Active", "ANT-026"),
        ("Vehicle Operator", "Alpha", "Coastal Port", "Active", "ANT-026"),
        ("Medical Officer", "Alpha", "Medical Infirmary", "Active", "ANT-026"),
        ("Meteorologist", "Alpha", "Weather Dome", "Active", "ANT-026"),
        ("Communications Officer", "Alpha", "Radio Mast", "Active", "ANT-026"),
        ("Lead Engineer", "Bravo", "Power Plant", "Active", "ANT-026"),
        ("Field Researcher", "Bravo", "Marine Lab", "Active", "ANT-026"),
        # ANT-027 Team (Crucial for the Connected Chain: 4 on SV-03)
        ("Senior Glaciologist", "Bravo", "Survey Zone A (Halted)", "Active", "ANT-027"),
        ("Ice Radar Specialist", "Bravo", "Survey Zone A (Halted)", "Active", "ANT-027"),
        ("Field Navigator", "Bravo", "Survey Zone A (Halted)", "Active", "ANT-027"),
        ("Snowcat Operator", "Bravo", "Survey Zone A (Halted)", "Active", "ANT-027"),
        ("Geophysicist", "Bravo", "Bharati Research", "Active", "ANT-027"),
        ("Core Drilling Tech", "Bravo", "Bharati Research", "Active", "ANT-027"),
        ("Safety Officer", "Bravo", "Bharati Command", "Active", "ANT-027"),
        ("Environmental Tech", "Bravo", "Bharati Lab", "Active", "ANT-027"),
        ("Sensor Technician", "Bravo", "Survey Zone A", "Active", "ANT-027"),
        ("Seismic Analyst", "Bravo", "Bharati Science", "Active", "ANT-027"),
        ("Field Assistant", "Bravo", "Bharati Base", "Active", "ANT-027"),
        # ANT-028 Supply Team (9)
        ("Supply Coordinator", "Charlie", "Coastal Port", "Active", "ANT-028"),
        ("Heavy Vehicle Driver", "Charlie", "Coastal Port", "Active", "ANT-028"),
        ("Fuel Specialist", "Charlie", "Storage Zone", "Active", "ANT-028"),
        ("Cargo Handler", "Charlie", "Coastal Port", "Active", "ANT-028"),
        ("Cargo Handler", "Charlie", "Storage Zone", "Active", "ANT-028"),
        ("Mechanic", "Charlie", "Coastal Garage", "Active", "ANT-028"),
        ("Inventory Auditor", "Charlie", "Bharati Depot", "Active", "ANT-028"),
        ("Transport Scout", "Charlie", "Route R-01", "Active", "ANT-028"),
        ("Assistant Driver", "Charlie", "Coastal Port", "Active", "ANT-028"),
        # ANT-029 Inland Team (8)
        ("Atmospheric Physicist", "Delta", "Inland Sector", "Active", "ANT-029"),
        ("Balloon Payload Tech", "Delta", "Inland Sector", "Active", "ANT-029"),
        ("Data Telemetry Specialist", "Delta", "Weather Dome", "Active", "ANT-029"),
        ("Field Assistant", "Delta", "Inland Sector", "Active", "ANT-029"),
        ("Climatologist", "Delta", "Research Lab", "Active", "ANT-029"),
        ("Equipment Specialist", "Delta", "Inland Sector", "Active", "ANT-029"),
        ("Snowmobile Driver", "Delta", "Research Zone B", "Active", "ANT-029"),
        ("Safety Escort", "Delta", "Inland Sector", "Active", "ANT-029"),
        # Station Maintenance & Standby (8)
        ("Turbine Engineer", "Echo", "Power Plant", "Active", "ANT-030"),
        ("HVAC Specialist", "Echo", "Living Habitat", "Active", "ANT-030"),
        ("Electrician", "Echo", "Station Grid", "Active", "ANT-030"),
        ("Structural Welder", "Echo", "Workshop", "Active", "ANT-030"),
        ("Emergency Lead", "Foxtrot", "Ready Bay", "Standby", "ANT-031"),
        ("Paramedic", "Foxtrot", "Ready Bay", "Standby", "ANT-031"),
        ("Rescue Diver / Ice Scout", "Foxtrot", "Ready Bay", "Standby", "ANT-031"),
        ("Heavy Recovery Driver", "Foxtrot", "Ready Bay", "Standby", "ANT-031")
    ]

    names_pool = [
        "Sunita Rao", "Aditya Sharma", "Rajesh Pillai", "Kiran Patel", "Vikram Seth",
        "Dr. Anita Roy", "Dr. Meera Sen", "Pooja Deshmukh", "Arun Verma", "Deepak Joshi",
        "Dr. Ravi Nair", "Vikas Sharma", "Ananya Roy", "Tenzing Norbu", "Sanjay Kulkarni",
        "Manish Tiwari", "Preeti Sengupta", "Rahul Nambiar", "Gaurav Bhatt", "Sneha Menon",
        "Farhan Akhtar", "Amitabh Das", "Naveen Choudhury", "Bipin Rawat", "Sandeep Ghosh",
        "Harish Chandra", "Neha Kapoor", "Kavita Swaminathan", "Rohan Mehta", "Prakash Yadav",
        "Dr. Suresh Menon", "Alok Ranjan", "Ritika Saxena", "Jayant Sinha", "Priyanka Das",
        "Mahesh Kadam", "Dinesh Karthik", "Shreya Mallick", "Rakesh Jhunjhun", "Anil Chauhan",
        "Devendra Pal", "Kalyan Sundaram", "Col. Vijay Kumar", "Dr. Pooja Iyer", "Suraj Bhan", "Govind Swarup"
    ]

    personnel = []
    for i in range(46):
        role, team, loc, status, mission_id = roles_pool[i]
        personnel.append({
            "id": f"P-{i+1:03d}",
            "name": names_pool[i],
            "role": role,
            "team": team,
            "location": loc,
            "status": status,
            "mission": mission_id
        })

    # 4. Assets (Exactly 17 records: A-001 to A-017)
    assets_raw = [
        ("A-001", "Research Vessel", "Polar Explorer", "Operational", "ANT-026", "Harbor Dock"),
        ("A-002", "Aircraft", "Twin Otter-01", "Operational", "ANT-027", "Airstrip Ice Runway"),
        ("A-003", "Aircraft", "Twin Otter-02", "Maintenance", "ANT-029", "Maintenance Hangar"),
        ("A-004", "Snow Vehicle", "SV-01", "Operational", "ANT-026", "Coastal Zone"),
        ("A-005", "Snow Vehicle", "SV-02", "Operational", "ANT-026", "Bharati Base"),
        ("A-006", "Snow Vehicle", "SV-03", "Operational", "ANT-027", "Survey Zone A (Halted on R-03)"),
        ("A-007", "Cargo Carrier", "CC-01", "Operational", "ANT-028", "Coastal Port"),
        ("A-008", "Generator", "GEN-04", "Operational", "Station", "Bharati Power Plant"),
        ("A-009", "Fuel Tanker", "FT-02", "Operational", "ANT-028", "Coastal Port"),
        ("A-010", "Heavy Crane", "HC-01", "Operational", "Station", "Port Staging Area"),
        ("A-011", "Snowmobile", "SM-01", "Operational", "ANT-029", "Inland Station"),
        ("A-012", "Snowmobile", "SM-02", "Operational", "ANT-026", "Coastal Perimeter"),
        ("A-013", "Satellite Radar Dish", "SAT-01", "Operational", "Station", "Comms Mast 1"),
        ("A-014", "Deep Ice Drill", "ID-02", "Operational", "ANT-027", "Survey Zone A Staging"),
        ("A-015", "Emergency Rescue Sled", "ERS-01", "Operational", "ANT-031", "Ready Bay"),
        ("A-016", "Backup Generator", "GEN-05", "Standby", "Station", "Outpost Gamma"),
        ("A-017", "Weather LIDAR Array", "LID-01", "Operational", "ANT-029", "Weather Dome")
    ]
    assets = [
        {
            "id": a[0],
            "type": a[1],
            "name": a[2],
            "status": a[3],
            "mission": a[4],
            "location": a[5]
        }
        for a in assets_raw
    ]

    # 5. Cargo & Logistics (Exactly 38 records: C-001 to C-038)
    # Highlight C-017 as the critical delayed item linked to Route R-03!
    cargo_templates = [
        ("Fuel", "Polar Grade Diesel Drums (4x200L)", 2400, "Bharati Station", "In Transit", "Critical"),
        ("Medical", "Emergency Trauma & Hypothermia Packs", 180, "Bharati Station", "Delivered", "Critical"),
        ("Food", "Freeze-Dried Rations Container #1", 920, "Bharati Station", "In Transit", "High"),
        ("Scientific Equipment", "Oceanographic CTD Sonde Rig", 340, "Coastal Zone", "Loaded", "Medium"),
        ("Spare Parts", "Turbine Seals & Injector Kit", 210, "Bharati Station", "Pending", "High"),
        ("Fuel", "Aviation Kerosene Jet A-1", 3200, "Airstrip Depot", "In Transit", "Critical"),
        ("Food", "High-Calorie Protein Bars & Grain Packs", 650, "Bharati Station", "Delivered", "Medium"),
        ("Communication Equipment", "Iridium High-Gain Dome Antenna", 120, "Bharati Station", "Delivered", "High"),
        ("Shelter Equipment", "All-Weather Polar Geodesic Tent #1", 280, "Survey Zone A", "Delivered", "Medium"),
        ("Shelter Equipment", "Extreme Cold Sleeping Bags & Liners", 150, "Survey Zone A", "Delivered", "Medium"),
        ("Waste Containers", "Sealed Biological & Hazardous Waste Drum", 420, "Coastal Port", "Staged", "Low"),
        ("Fuel", "Heavy Snowcat Diesel Tanks", 1850, "Coastal Port", "In Transit", "Critical"),
        ("Medical", "Surgical Antibiotics & Frostbite Ointments", 95, "Bharati Station", "Delivered", "High"),
        ("Scientific Equipment", "Atmospheric Sounding Balloons & Gas", 310, "Inland Sector", "In Transit", "Medium"),
        ("Spare Parts", "Hydraulic Tracks for Snowcat SV-03", 480, "Storage Zone", "Pending", "High"),
        ("Communication Equipment", "VHF Field Radios & Relay Repeater", 85, "Research Zone B", "Delivered", "High"),
        # C-017: THE KEY DISRUPTED CARGO
        ("Scientific Equipment", "Deep-Shelf Ice Core Sampling Telemetry", 420, "Ice Shelf Point (via R-03)", "Delayed / Halted", "Critical"),
        ("Food", "Vitamin Supplements & Fresh Canned Meat", 540, "Bharati Station", "In Transit", "Medium"),
        ("Waste Containers", "Metal Scrap & Battery Disposal Bin", 680, "Coastal Port", "Staged", "Low"),
        ("Shelter Equipment", "Mobile Survival Shelter Pod", 1100, "Coastal Sector", "In Transit", "High"),
        ("Spare Parts", "Twin Otter De-Icing Boots & Filters", 160, "Maintenance Hangar", "Delivered", "High"),
        ("Fuel", "Stove & Generator Kerosene Canisters", 890, "Bharati Depot", "In Transit", "High"),
        ("Medical", "Blood Plasma Refrigerated Unit", 65, "Bharati Station", "Delivered", "Critical"),
        ("Scientific Equipment", "Seismic Wave Geophone Array", 270, "Survey Zone A", "Delivered", "High"),
        ("Food", "Emergency Survival Ration Packs (20-day)", 450, "Survey Zone A", "Delivered", "High"),
        ("Communication Equipment", "Fiber Optic Tether Spool (2km)", 190, "Coastal Port", "Loaded", "Low"),
        ("Spare Parts", "Alternator & Belts for Generator GEN-04", 140, "Power Plant", "Delivered", "High"),
        ("Fuel", "Synthetic Engine Oil (Low Temp -50°C)", 320, "Coastal Port", "Loaded", "Medium"),
        ("Shelter Equipment", "Insulated Ducting & Heated Floor Tiles", 390, "Bharati Base", "In Transit", "Low"),
        ("Waste Containers", "Greywater Recirculation Sludge Pod", 780, "Coastal Port", "Staged", "Low"),
        ("Scientific Equipment", "UV Spectral Radiometer Sensor", 115, "Inland Sector", "Delivered", "Medium"),
        ("Food", "Bulk Coffee, Tea & Dry Milk Bags", 380, "Bharati Station", "Delivered", "Low"),
        ("Medical", "Defibrillator Unit & Oxygen Cylinders", 110, "Ready Bay", "Delivered", "Critical"),
        ("Spare Parts", "Tungsten Drill Bits for Ice Coring", 260, "Survey Zone A", "Delivered", "High"),
        ("Fuel", "Snowmobile Mixed 2-Stroke Fuel", 620, "Inland Station", "In Transit", "Medium"),
        ("Shelter Equipment", "Portable Snow Melting Stove Units", 175, "Survey Zone A", "Delivered", "Medium"),
        ("Communication Equipment", "Satellite Beacon Transponders (x6)", 45, "Ready Bay", "Delivered", "High"),
        ("Scientific Equipment", "Magnetometer Baseline Sensor", 95, "Research Zone B", "Delivered", "Medium")
    ]

    cargo = []
    for i, (cat, name, wt, dest, status, prio) in enumerate(cargo_templates, start=1):
        cargo.append({
            "id": f"C-{i:03d}",
            "name": name,
            "category": cat,
            "weight_kg": wt,
            "destination": dest,
            "status": status,
            "priority": prio,
            "is_disrupted": (i == 17)
        })

    # 6. Routes (9 active routes: R-01 to R-09)
    routes = [
        {"id": "R-01", "name": "Port Highway", "from": "Coastal Port", "to": "Bharati Station", "distance_km": 84, "condition": "Stable", "risk": "Low", "speed_kmh": 40},
        {"id": "R-02", "name": "Station Access Spur", "from": "Bharati Station", "to": "Survey Zone A", "distance_km": 32, "condition": "Moderate", "risk": "Medium", "speed_kmh": 25},
        # R-03: THE DISRUPTED HIGH RISK ROUTE
        {"id": "R-03", "name": "Shelf Traverse Corridor", "from": "Survey Zone A", "to": "Ice Shelf Point", "distance_km": 21, "condition": "Deteriorating", "risk": "High", "speed_kmh": 12, "restriction": "HOLD_POSITION"},
        {"id": "R-04", "name": "Port Logistics Link", "from": "Coastal Port", "to": "Storage Zone", "distance_km": 16, "condition": "Stable", "risk": "Low", "speed_kmh": 45},
        {"id": "R-05", "name": "Inland Science Line", "from": "Bharati Station", "to": "Research Zone B", "distance_km": 44, "condition": "Moderate", "risk": "Medium", "speed_kmh": 28},
        {"id": "R-06", "name": "Coastal Recon Route", "from": "Bharati Station", "to": "Coastal Zone", "distance_km": 28, "condition": "Stable", "risk": "Low", "speed_kmh": 35},
        {"id": "R-07", "name": "Airstrip Runway Spur", "from": "Coastal Port", "to": "Airstrip Ice Runway", "distance_km": 12, "condition": "Stable", "risk": "Low", "speed_kmh": 50},
        {"id": "R-08", "name": "Deep Plateau Path", "from": "Research Zone B", "to": "Inland Sector", "distance_km": 68, "condition": "Moderate", "risk": "Medium", "speed_kmh": 22},
        {"id": "R-09", "name": "Emergency Evac Spur", "from": "Survey Zone A", "to": "Coastal Port (West)", "distance_km": 48, "condition": "Moderate", "risk": "Medium", "speed_kmh": 30}
    ]

    # 7. Environmental Time-Series Data (500 data points, 30-minute intervals)
    # Leads up to the recent weather spike on Route R-03 (Wind +37%, Visibility -28%)
    environmental_timeseries = []
    start_sim_time = base_time - timedelta(hours=250)
    
    for step in range(500):
        t = start_sim_time + timedelta(minutes=30 * step)
        # Baseline weather
        temp = -16.0 - (step % 24) * 0.25
        wind = 25.0 + (step % 18) * 1.2
        vis = 9.0 - (step % 12) * 0.2
        pressure = 998.0 + (step % 15) * 0.4
        ice_stability = "Stable"
        sea_cond = "Calm Swell"
        risk_level = "Low"

        # Last 6 hours (recent 12 steps) demonstrate the sudden storm onset
        if step >= 488:
            delta_storm = step - 488
            temp = -16.0 - delta_storm * 0.35      # drops to -20.2°C
            wind = 28.0 + delta_storm * 1.6        # spikes from 28 to 47+ km/h (+37%+)
            vis = max(4.8, 8.4 - delta_storm * 0.3) # drops from 8.4 to 5.4 km (-28%-)
            pressure = 992.0 - delta_storm * 1.1   # barometric pressure drops
            if delta_storm >= 6:
                ice_stability = "Deteriorating (Crevasses Opening)"
                sea_cond = "Rough / Pack Ice Compression"
                risk_level = "High"
            else:
                ice_stability = "Moderate"
                risk_level = "Medium"

        environmental_timeseries.append({
            "timestamp": t.isoformat(),
            "time_label": t.strftime("%H:%M"),
            "temperature_c": round(temp, 1),
            "wind_speed_kmh": round(wind, 1),
            "wind_direction": "SSE" if step % 2 == 0 else "SE",
            "visibility_km": round(vis, 1),
            "pressure_hpa": round(pressure, 1),
            "snowfall": "Heavy Drifting" if risk_level == "High" else ("Light Flurries" if risk_level == "Medium" else "Nil"),
            "ice_stability": ice_stability,
            "sea_condition": sea_cond,
            "risk_level": risk_level
        })

    # 8. Alerts (18 alerts: 6 Active, 2 Investigating, 10 Resolved)
    alerts = [
        {"id": "ALT-001", "type": "Wind Increase", "severity": "Medium", "location": "Route R-03", "status": "Active", "description": "Wind speed elevated to 47 km/h (+37% over 2h) along traverse corridor.", "timestamp": (base_time - timedelta(minutes=45)).isoformat()},
        {"id": "ALT-002", "type": "Visibility Drop", "severity": "High", "location": "Survey Zone A", "status": "Active", "description": "Optical visibility decreased by 28% to 5.4 km due to blowing ground drift.", "timestamp": (base_time - timedelta(minutes=55)).isoformat()},
        {"id": "ALT-003", "type": "Ice Instability", "severity": "High", "location": "Coastal Zone", "status": "Investigating", "description": "Tidal cracks detected across shelf margin sector 4.", "timestamp": (base_time - timedelta(hours=2)).isoformat()},
        {"id": "ALT-004", "type": "Vehicle Delay", "severity": "Low", "location": "Route R-01", "status": "Resolved", "description": "CC-01 minor hydraulic valve delay resolved.", "timestamp": (base_time - timedelta(hours=8)).isoformat()},
        {"id": "ALT-005", "type": "Fuel Level", "severity": "Medium", "location": "Storage Zone", "status": "Active", "description": "Transfer buffer tank at 38% capacity pending FT-02 dispatch.", "timestamp": (base_time - timedelta(hours=3)).isoformat()},
        {"id": "ALT-006", "type": "Communication Drop", "severity": "High", "location": "Research Zone B", "status": "Resolved", "description": "VHF repeater solar battery back online.", "timestamp": (base_time - timedelta(hours=14)).isoformat()},
        {"id": "ALT-007", "type": "Barometric Drop", "severity": "Medium", "location": "Bharati Sector", "status": "Active", "description": "Rapid atmospheric pressure drop of 8.2 hPa in 3 hours.", "timestamp": (base_time - timedelta(hours=1, minutes=15)).isoformat()},
        {"id": "ALT-008", "type": "Asset Halted", "severity": "High", "location": "Route R-03", "status": "Active", "description": "SV-03 halted in safe holding formation under blizzard SOP v2.", "timestamp": (base_time - timedelta(minutes=30)).isoformat()},
        {"id": "ALT-009", "type": "Cargo Transfer Paused", "severity": "Medium", "location": "Survey Zone A", "status": "Active", "description": "Cargo C-017 telemetry container secured in vehicle hold pending route clearance.", "timestamp": (base_time - timedelta(minutes=25)).isoformat()},
        {"id": "ALT-010", "type": "Temperature Plummet", "severity": "Low", "location": "Inland Sector", "status": "Resolved", "description": "Temperature recovered to -18°C.", "timestamp": (base_time - timedelta(hours=20)).isoformat()},
        {"id": "ALT-011", "type": "Generator Routine Load", "severity": "Low", "location": "Power Plant", "status": "Resolved", "description": "Automatic switchover to secondary generator cell successful.", "timestamp": (base_time - timedelta(hours=28)).isoformat()},
        {"id": "ALT-012", "type": "Route Hazard", "severity": "High", "location": "Route R-03", "status": "Investigating", "description": "Survey Zone A to Ice Shelf Point traversal restricted.", "timestamp": (base_time - timedelta(minutes=35)).isoformat()},
        {"id": "ALT-013", "type": "Drift Incursion", "severity": "Low", "location": "Airstrip Ice Runway", "status": "Resolved", "description": "Snow blowers cleared southern tarmac section.", "timestamp": (base_time - timedelta(hours=18)).isoformat()},
        {"id": "ALT-014", "type": "Perimeter Beacon Ping", "severity": "Low", "location": "Coastal Perimeter", "status": "Resolved", "description": "Automatic sensor telemetry heartbeat re-verified.", "timestamp": (base_time - timedelta(hours=22)).isoformat()},
        {"id": "ALT-015", "type": "Radio Static", "severity": "Low", "location": "Radio Mast", "status": "Resolved", "description": "Auroral magnetic interference subsided.", "timestamp": (base_time - timedelta(hours=16)).isoformat()},
        {"id": "ALT-016", "type": "Medical Supply Check", "severity": "Low", "location": "Medical Infirmary", "status": "Resolved", "description": "Deep freeze plasma inventory reconciled.", "timestamp": (base_time - timedelta(hours=36)).isoformat()},
        {"id": "ALT-017", "type": "Sea Swell Warning", "severity": "Medium", "location": "Coastal Port", "status": "Resolved", "description": "Mooring lines adjusted on Polar Explorer vessel.", "timestamp": (base_time - timedelta(hours=12)).isoformat()},
        {"id": "ALT-018", "type": "Meltwater Channel", "severity": "Low", "location": "Route R-06", "status": "Resolved", "description": "Glacial melt runoff refrozen, route confirmed stable.", "timestamp": (base_time - timedelta(hours=24)).isoformat()}
    ]

    # 9. Incidents (6 incidents: 2 Open, 4 Resolved)
    incidents = [
        {
            "id": "INC-004",
            "title": "Severe Traverse Weather & Route Degradation",
            "type": "Route Hazard",
            "severity": "High",
            "location": "Survey Zone A (Route R-03)",
            "mission": "ANT-027",
            "status": "Under Investigation (Open)",
            "detected_by": "ARORA Deterministic Solver + Field Anemometer Array",
            "trigger": "Increasing wind (47 km/h, +37%) + reduced visibility (5.4 km, -28%) + deteriorating shelf ice.",
            "affected_assets": ["SV-03 (Snow Vehicle)"],
            "affected_personnel": [
                "Dr. Ravi Nair (P-011, Senior Glaciologist)",
                "Vikas Sharma (P-012, Ice Radar Specialist)",
                "Ananya Roy (P-013, Field Navigator)",
                "Tenzing Norbu (P-014, Snowcat Operator)"
            ],
            "affected_route": "R-03 (Survey Zone A -> Ice Shelf Point)",
            "affected_cargo": ["C-017 (Ice Core Sampling Telemetry)"],
            "response_status": "Route temporarily restricted (HOLD_POSITION). Team sheltered in SV-03 with auxiliary heating. Emergency Support ANT-031 alerted.",
            "timestamp": (base_time - timedelta(minutes=40)).isoformat()
        },
        {
            "id": "INC-002",
            "title": "Fuel Transfer Line Low Pressure",
            "type": "Logistics Anomaly",
            "severity": "Medium",
            "location": "Storage Zone (Route R-04)",
            "mission": "ANT-028",
            "status": "Open",
            "detected_by": "Depot Sensor Telemetry",
            "trigger": "Pressure drop in secondary fuel manifold valve #3.",
            "affected_assets": ["FT-02 (Fuel Tanker)"],
            "affected_personnel": ["Kiran Patel (P-004)", "Harish Chandra (P-026)"],
            "affected_route": "R-04",
            "affected_cargo": ["C-001 (Diesel Drums)", "C-012 (Snowcat Diesel)"],
            "response_status": "Manual valve bypass engaged. Heating coils activated.",
            "timestamp": (base_time - timedelta(hours=2, minutes=10)).isoformat()
        },
        {
            "id": "INC-001",
            "title": "Satellite Repeater Power Loss",
            "type": "Communication Failure",
            "severity": "High",
            "location": "Research Zone B",
            "mission": "ANT-029",
            "status": "Resolved",
            "detected_by": "Base Telemetry Ping",
            "trigger": "Frost buildup on solar panel collector.",
            "affected_assets": ["SAT-01"],
            "affected_personnel": ["Dr. Meera Sen (P-007)"],
            "affected_route": "R-05",
            "affected_cargo": ["C-016"],
            "response_status": "Cleaned and switched to auxiliary battery. Normal transmission restored.",
            "timestamp": (base_time - timedelta(hours=14)).isoformat()
        },
        {
            "id": "INC-003",
            "title": "Runway Surface Glaze Friction Loss",
            "type": "Infrastructure Hazard",
            "severity": "Low",
            "location": "Airstrip Ice Runway",
            "mission": "ANT-027",
            "status": "Resolved",
            "detected_by": "Flight Safety Inspection",
            "trigger": "Sudden warming glaze over packed ice apron.",
            "affected_assets": ["Twin Otter-01 (A-002)"],
            "affected_personnel": ["Bipin Rawat (P-024)"],
            "affected_route": "R-07",
            "affected_cargo": ["C-006"],
            "response_status": "Grit scarifier grooved the runway surface. Flights cleared.",
            "timestamp": (base_time - timedelta(hours=22)).isoformat()
        },
        {
            "id": "INC-005",
            "title": "Auxiliary Turbine Bearing Vibration",
            "type": "Mechanical Fault",
            "severity": "Low",
            "location": "Power Plant",
            "mission": "ANT-030",
            "status": "Resolved",
            "detected_by": "Vibration Accelerometer",
            "trigger": "Normal wear on bearing race #2.",
            "affected_assets": ["GEN-04 (A-008)"],
            "affected_personnel": ["Arun Verma (P-009)"],
            "affected_route": "None",
            "affected_cargo": ["C-005", "C-027"],
            "response_status": "Lubrication flushed and scheduled for ANT-030 overhaul.",
            "timestamp": (base_time - timedelta(hours=34)).isoformat()
        },
        {
            "id": "INC-006",
            "title": "Mooring Hawser Tension Warning",
            "type": "Marine Hazard",
            "severity": "Medium",
            "location": "Coastal Port",
            "mission": "ANT-026",
            "status": "Resolved",
            "detected_by": "Tidal Sensor",
            "trigger": "Spring pack ice pressure wave.",
            "affected_assets": ["Polar Explorer (A-001)"],
            "affected_personnel": ["Vikram Seth (P-005)"],
            "affected_route": "R-01",
            "affected_cargo": ["C-011", "C-019"],
            "response_status": "Winch slackened 2 meters; ice deflectors positioned.",
            "timestamp": (base_time - timedelta(hours=16)).isoformat()
        }
    ]

    # 10. AI Intelligence Recommendations (Grounded in Connected Dataset)
    ai_intelligence = [
        {
            "id": "AI-REC-001",
            "title": "Elevated Route Risk: Halt & Sheltered Hold on R-03",
            "category": "Risk Detection",
            "severity": "High",
            "icon": "AlertTriangle",
            "description": "Wind speed increased by 37% over the last 2 hours (28 -> 47 km/h) while visibility decreased by 28% (8.4 -> 5.4 km) along Route R-03.",
            "affected_mission": "ANT-027 (Ice Shelf Survey)",
            "affected_personnel_count": 4,
            "affected_personnel_names": ["Dr. Ravi Nair", "Vikas Sharma", "Ananya Roy", "Tenzing Norbu"],
            "affected_asset": "SV-03 (Snow Vehicle)",
            "suggested_action": "Review route conditions before continuing movement. Maintain sheltered vehicle hold at Survey Zone A waypoint 4.",
            "rag_citation": "Polar Safety SOP v2.0 - Section 3.2: Severe Weather Stoppage Rules & Crevasse Hazard Protocol.",
            "status": "Pending Commander Review"
        },
        {
            "id": "AI-REC-002",
            "title": "Logistics Disruption: Delay Cargo C-017 Transfer",
            "category": "Logistics Risk",
            "severity": "High",
            "icon": "Package",
            "description": "Cargo C-017 (Deep-Shelf Ice Core Sampling Telemetry, 420 kg) is scheduled for transfer through Route R-03 while environmental risk is currently High.",
            "affected_mission": "ANT-027 (Dependent on C-017)",
            "affected_cargo": "C-017",
            "suggested_action": "Postpone transfer window by 6 hours until wind drops below 35 km/h. Evaluate alternative inland spur R-09 if delay exceeds 12 hours.",
            "rag_citation": "Fuel & Power Contingency SOP v4.2 - Section 4.1: Cargo Delay Impact Propagation.",
            "status": "Pending Commander Review"
        }
    ]

    # 11. Unified Connected Causality Chain (The Core USP)
    causality_chain = {
        "title": "ARORA Cohesive Operational Causality Flow",
        "description": "Deterministic event propagation connecting environmental telemetry, route safety, mission execution, personnel welfare, and cargo manifests.",
        "nodes": [
            {
                "step": 1,
                "layer": "ENVIRONMENT",
                "label": "Telemetry Spike",
                "value": "Wind 47 km/h (+37%) · Visibility 5.4 km (-28%)",
                "badge": "Sensors Array",
                "status": "ALERT_TRIGGERED"
            },
            {
                "step": 2,
                "layer": "ROUTES",
                "label": "Route R-03",
                "value": "Survey Zone A → Ice Shelf Point: Condition Deteriorating",
                "badge": "Risk: High",
                "status": "ROUTE_RESTRICTED"
            },
            {
                "step": 3,
                "layer": "MISSIONS",
                "label": "Mission ANT-027",
                "value": "Ice Shelf Survey Halted at 42% completion",
                "badge": "P1 Critical",
                "status": "MISSION_IMPACTED"
            },
            {
                "step": 4,
                "layer": "PERSONNEL",
                "label": "Field Team (4 Deployed)",
                "value": "Dr. Ravi Nair, Vikas Sharma, Ananya Roy, Tenzing Norbu",
                "badge": "All Safe in SV-03",
                "status": "SHELTERED"
            },
            {
                "step": 5,
                "layer": "ASSETS",
                "label": "Asset SV-03",
                "value": "Snow Vehicle running auxiliary heating at Zone A",
                "badge": "Operational",
                "status": "HOLD_POSITION"
            },
            {
                "step": 6,
                "layer": "LOGISTICS",
                "label": "Cargo C-017",
                "value": "Ice Core Telemetry (420 kg) transit delayed",
                "badge": "Delayed",
                "status": "TRANSFER_PAUSED"
            },
            {
                "step": 7,
                "layer": "AI INTELLIGENCE",
                "label": "ARORA Decision Support",
                "value": "Contextual alert generated + 6-hour delay recommendation",
                "badge": "Grounded SOP v2",
                "status": "RECOMMENDATION_READY"
            },
            {
                "step": 8,
                "layer": "RESPONSE",
                "label": "Human Commander Approval",
                "value": "Mission coordinator reviews & ratifies route hold",
                "badge": "Approval Workflow",
                "status": "PENDING_COMMANDER"
            }
        ]
    }

    # Assemble complete dataset
    full_dataset = {
        "overview": overview,
        "missions": missions,
        "personnel": personnel,
        "assets": assets,
        "cargo": cargo,
        "routes": routes,
        "environmental_timeseries": environmental_timeseries,
        "alerts": alerts,
        "incidents": incidents,
        "ai_intelligence": ai_intelligence,
        "causality_chain": causality_chain
    }

    return full_dataset

if __name__ == "__main__":
    data = generate_dataset()
    os.makedirs("data", exist_ok=True)
    target_path = os.path.join("data", "bharati_mission_dataset.json")
    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Successfully generated Bharati Research Station dataset: {target_path}")
    print(f"Personnel: {len(data['personnel'])}, Assets: {len(data['assets'])}, Cargo: {len(data['cargo'])}, Routes: {len(data['routes'])}, Env records: {len(data['environmental_timeseries'])}")
