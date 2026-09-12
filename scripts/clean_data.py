#!/usr/bin/env python3
"""
Data Cleaning Script for Michelin Guide Restaurants 2021 Dataset
"""
import os
import json
import kagglehub
import pandas as pd

def clean_michelin_dataset():
    print("Downloading dataset via kagglehub...")
    dataset_path = kagglehub.dataset_download("ngshiheng/michelin-guide-restaurants-2021")
    csv_file = os.path.join(dataset_path, "michelin_my_maps.csv")
    
    if not os.path.exists(csv_file):
        # Fallback search if name is slightly different
        for f in os.listdir(dataset_path):
            if f.endswith(".csv"):
                csv_file = os.path.join(dataset_path, f)
                break

    print(f"Reading raw CSV from {csv_file}...")
    df = pd.read_csv(csv_file)
    print(f"Raw record count: {len(df)}")

    # Drop rows missing mandatory fields: Name, Latitude, Longitude
    df = df.dropna(subset=["Name", "Latitude", "Longitude"])
    print(f"Record count after dropping missing Name/Lat/Lon: {len(df)}")

    cleaned_restaurants = []

    for idx, row in df.iterrows():
        # Price parsing
        price_str = str(row["Price"]).strip() if pd.notna(row["Price"]) and str(row["Price"]).strip().lower() != "none" else None
        if price_str:
            # Measure length of currency symbols (e.g., $, $$, $$$, $$$$, €, ¥, ฿)
            price_tier = min(max(len(price_str), 1), 4)
        else:
            price_tier = None

        # Cuisine splitting
        cuisine_raw = str(row["Cuisine"]) if pd.notna(row["Cuisine"]) else ""
        cuisines = [c.strip() for c in cuisine_raw.split(",") if c.strip()]

        # Location splitting into City & Country
        location_raw = str(row["Location"]).strip() if pd.notna(row["Location"]) else ""
        loc_parts = [p.strip() for p in location_raw.split(",") if p.strip()]
        if len(loc_parts) >= 2:
            city = loc_parts[0]
            country = loc_parts[-1]
        elif len(loc_parts) == 1:
            city = loc_parts[0]
            country = loc_parts[0]
        else:
            city = ""
            country = ""

        # Facilities & Services splitting
        facilities_raw = str(row["FacilitiesAndServices"]) if pd.notna(row["FacilitiesAndServices"]) else ""
        facilities = [f.strip() for f in facilities_raw.split(",") if f.strip()]

        # Award
        award = str(row["Award"]).strip() if pd.notna(row["Award"]) else "Selected Restaurants"

        # GreenStar
        green_star_raw = row["GreenStar"]
        green_star = bool(green_star_raw == 1 or green_star_raw == True or str(green_star_raw).strip().lower() in ["1", "true", "yes"])

        # Website & Phone (dropping Url)
        phone = str(row["PhoneNumber"]).strip() if pd.notna(row["PhoneNumber"]) and str(row["PhoneNumber"]).strip().lower() != "nan" else None
        # Clean float formatting in phone numbers if present (e.g. 85225378859.0 -> 85225378859)
        if phone and phone.endswith(".0"):
            phone = phone[:-2]

        website = str(row["WebsiteUrl"]).strip() if pd.notna(row["WebsiteUrl"]) and str(row["WebsiteUrl"]).strip().lower() != "nan" else None

        address = str(row["Address"]).strip() if pd.notna(row["Address"]) else ""
        description = str(row["Description"]).strip() if pd.notna(row["Description"]) else ""

        restaurant_record = {
            "id": f"rest_{idx + 1}",
            "name": str(row["Name"]).strip(),
            "address": address,
            "location": location_raw,
            "city": city,
            "country": country,
            "price": price_str,
            "priceTier": price_tier,
            "cuisines": cuisines,
            "longitude": float(row["Longitude"]),
            "latitude": float(row["Latitude"]),
            "phoneNumber": phone,
            "websiteUrl": website,
            "award": award,
            "greenStar": green_star,
            "facilitiesAndServices": facilities,
            "description": description
        }

        cleaned_restaurants.append(restaurant_record)

    output_dir = os.path.join("backend", "data")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "restaurants.json")

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(cleaned_restaurants, f, indent=2, ensure_ascii=False)

    print(f"Successfully exported {len(cleaned_restaurants)} cleaned restaurants to {output_file}")

if __name__ == "__main__":
    clean_michelin_dataset()
