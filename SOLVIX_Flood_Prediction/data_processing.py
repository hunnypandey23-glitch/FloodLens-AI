"""
AI-Based Flood Prediction - Data Processing Script
Team: SOLVIX (SY501) | MIT ADT University

This script generates a synthetic sample flood dataset for demonstration
and training purposes. The data is generated using rule-based thresholds
with controlled randomness to simulate realistic environmental patterns.

Prerequisites:
  pip install pandas numpy

Usage:
  python data_processing.py

Output:
  data/flood_data.csv (1000 sample records with 7 columns)

WARNING: This is synthetic demonstration data, NOT real environmental data.
For production use, replace this with verified data from:
  - India Meteorological Department (IMD)
  - Central Water Commission (CWC)
  - OpenWeatherMap API
  - NASA SRTM elevation data
"""

import os
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
DATA_PATH = os.path.join(DATA_DIR, "flood_data.csv")


def assign_risk_label(row):
    """Assign risk label based on rule-based thresholds (same logic as app.py)."""
    score = 0

    rainfall = row["rainfall"]
    humidity = row["humidity"]
    river_level = row["river_level"]
    flood_depth = row["flood_depth"]
    elevation = row["elevation"]
    temperature = row["temperature"]

    if rainfall > 150:
        score += 60
    elif rainfall > 100:
        score += 45
    elif rainfall > 60:
        score += 30
    elif rainfall > 30:
        score += 15
    else:
        score += 5

    if humidity > 85:
        score += 15
    elif humidity > 70:
        score += 10
    elif humidity > 50:
        score += 5

    if river_level > 10:
        score += 20
    elif river_level > 7:
        score += 15
    elif river_level > 4:
        score += 8
    else:
        score += 2

    if flood_depth > 2:
        score += 20
    elif flood_depth > 1:
        score += 15
    elif flood_depth > 0.5:
        score += 8
    else:
        score += 3

    if elevation < 100:
        score += 15
    elif elevation < 300:
        score += 10
    elif elevation < 600:
        score += 5

    if temperature > 30 and humidity > 80:
        score += 5
    elif temperature > 35:
        score += 3

    if score >= 75:
        return 3  # Very High
    elif score >= 50:
        return 2  # High
    elif score >= 30:
        return 1  # Moderate
    else:
        return 0  # Low


def generate_sample_data(n_samples=1000, random_state=42):
    """Generate synthetic flood data with realistic distributions."""
    rng = np.random.RandomState(random_state)

    data = {
        "rainfall": rng.exponential(scale=50, size=n_samples).clip(0, 300).round(1),
        "temperature": rng.normal(loc=28, scale=6, size=n_samples).clip(5, 48).round(1),
        "humidity": rng.normal(loc=70, scale=15, size=n_samples).clip(20, 100).round(0).astype(int),
        "river_level": rng.exponential(scale=4, size=n_samples).clip(0.5, 15).round(1),
        "flood_depth": rng.exponential(scale=0.8, size=n_samples).clip(0, 5).round(2),
        "elevation": rng.exponential(scale=400, size=n_samples).clip(10, 3000).round(0).astype(int),
    }

    df = pd.DataFrame(data)

    # Assign risk labels based on the rule-based system
    df["risk_label"] = df.apply(assign_risk_label, axis=1)

    # Add a risk_score column for reference
    df["risk_score"] = df.apply(
        lambda r: sum([
            60 if r["rainfall"] > 150 else 45 if r["rainfall"] > 100 else 30 if r["rainfall"] > 60 else 15 if r["rainfall"] > 30 else 5,
            15 if r["humidity"] > 85 else 10 if r["humidity"] > 70 else 5 if r["humidity"] > 50 else 0,
            20 if r["river_level"] > 10 else 15 if r["river_level"] > 7 else 8 if r["river_level"] > 4 else 2,
            20 if r["flood_depth"] > 2 else 15 if r["flood_depth"] > 1 else 8 if r["flood_depth"] > 0.5 else 3,
            15 if r["elevation"] < 100 else 10 if r["elevation"] < 300 else 5 if r["elevation"] < 600 else 0,
            5 if (r["temperature"] > 30 and r["humidity"] > 80) else 3 if r["temperature"] > 35 else 0,
        ]), axis=1
    )

    return df


def main():
    print("=" * 60)
    print("  Flood Prediction - Data Processing")
    print("  Team: SOLVIX (SY501) | MIT ADT University")
    print("=" * 60 + "\n")

    print("Generating 1000 synthetic sample records...")

    df = generate_sample_data(n_samples=1000)

    os.makedirs(DATA_DIR, exist_ok=True)
    df.to_csv(DATA_PATH, index=False)

    print(f"Dataset saved to: {DATA_PATH}")
    print(f"\nDataset shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    print(f"\nRisk label distribution:")
    label_names = {0: "Low", 1: "Moderate", 2: "High", 3: "Very High"}
    for label, count in df["risk_label"].value_counts().sort_index().items():
        print(f"  {label_names[label]:12s}: {count:4d} records")

    print(f"\nStatistical summary:")
    print(df[["rainfall", "temperature", "humidity", "river_level", "flood_depth", "elevation"]].describe().round(2))

    print(f"\n{'=' * 60}")
    print("  Data generation complete!")
    print(f"  You can now train the model with: python train_model.py")
    print(f"{'=' * 60}")
    print("\nNOTE: This is synthetic demonstration data, NOT real environmental data.")
    print("For production use, replace with verified data from IMD, CWC, or other sources.")


if __name__ == "__main__":
    main()
