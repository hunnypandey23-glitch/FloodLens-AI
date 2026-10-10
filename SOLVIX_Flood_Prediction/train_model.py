"""
AI-Based Flood Prediction - Model Training Script
Team: SOLVIX (SY501) | MIT ADT University

This script trains a Random Forest classifier on the sample flood dataset
to predict flood risk categories (Low, Moderate, High, Very High).

Prerequisites:
  pip install scikit-learn pandas numpy joblib

Usage:
  python train_model.py

The script will:
  1. Load the sample dataset from data/flood_data.csv
  2. Preprocess and split into training/testing sets
  3. Train a Random Forest classifier
  4. Evaluate accuracy and print a classification report
  5. Save the trained model and scaler to the models/ directory

After training, the Flask app (app.py) will automatically detect and
use the trained model alongside the rule-based assessment.

NOTE: The sample dataset is synthetically generated for demonstration.
For real predictions, replace data/flood_data.csv with verified
environmental data and retrain the model.
"""

import os
import sys
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "flood_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "flood_risk_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

FEATURES = ["rainfall", "temperature", "humidity", "river_level", "flood_depth", "elevation"]
TARGET = "risk_label"  # Encoded as: 0=Low, 1=Moderate, 2=High, 3=Very High

LABEL_NAMES = ["Low", "Moderate", "High", "Very High"]


def load_data():
    """Load the flood dataset from CSV."""
    if not os.path.exists(DATA_PATH):
        print(f"ERROR: Dataset not found at {DATA_PATH}")
        print("Please ensure data/flood_data.csv exists.")
        print("You can generate sample data with: python data_processing.py")
        sys.exit(1)

    df = pd.read_csv(DATA_PATH)
    print(f"Loaded {len(df)} records from {DATA_PATH}")
    print(f"Columns: {list(df.columns)}")
    print(f"Risk distribution:\n{df[TARGET].value_counts().sort_index()}\n")
    return df


def preprocess_data(df):
    """Split data into features and target, then train/test sets."""
    X = df[FEATURES].values
    y = df[TARGET].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    return X_train_scaled, X_test_scaled, y_train, y_test, scaler


def train_model(X_train, y_train):
    """Train a Random Forest classifier."""
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight="balanced",
    )
    model.fit(X_train, y_train)
    return model


def evaluate_model(model, X_test, y_test):
    """Evaluate the trained model and print metrics."""
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n{'=' * 50}")
    print(f"  Model Evaluation Results")
    print(f"{'=' * 50}")
    print(f"  Accuracy: {accuracy:.4f} ({accuracy * 100:.1f}%)")
    print(f"\n  Classification Report:")
    print(classification_report(y_test, y_pred, target_names=LABEL_NAMES, zero_division=0))
    print(f"  Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    print(f"{'=' * 50}\n")
    return accuracy


def save_model(model, scaler):
    """Save the trained model and scaler."""
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    print(f"Model saved to: {MODEL_PATH}")
    print(f"Scaler saved to: {SCALER_PATH}")


def show_feature_importance(model):
    """Display feature importance from the trained model."""
    importances = model.feature_importances_
    print(f"\nFeature Importance:")
    print(f"{'-' * 30}")
    for feat, imp in sorted(zip(FEATURES, importances), key=lambda x: -x[1]):
        bar = "#" * int(imp * 100)
        print(f"  {feat:20s} {imp:.4f}  {bar}")


def main():
    print("=" * 60)
    print("  Flood Risk Prediction - Model Training")
    print("  Team: SOLVIX (SY501) | MIT ADT University")
    print("=" * 60 + "\n")

    # Step 1: Load data
    print("Step 1: Loading dataset...")
    df = load_data()

    # Step 2: Preprocess
    print("Step 2: Preprocessing data...")
    X_train, X_test, y_train, y_test, scaler = preprocess_data(df)
    print(f"  Training samples: {len(X_train)}")
    print(f"  Testing samples: {len(X_test)}")

    # Step 3: Train
    print("Step 3: Training Random Forest classifier...")
    model = train_model(X_train, y_train)
    print("  Training complete.")

    # Step 4: Evaluate
    print("Step 4: Evaluating model...")
    accuracy = evaluate_model(model, X_test, y_test)

    # Step 5: Feature importance
    show_feature_importance(model)

    # Step 6: Save
    print("\nStep 5: Saving model and scaler...")
    save_model(model, scaler)

    print(f"\n{'=' * 60}")
    print("  Training complete!")
    print(f"  The Flask app will now use this model alongside")
    print(f"  the rule-based assessment for predictions.")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
