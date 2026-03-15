"""
app.py – Flask REST API for the Predictron 5G energy consumption predictor.

Endpoints:
    GET  /health   – Health check
    POST /predict  – Predict energy consumption

Run:
    python app.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ---------------------------------------------------------------------------
# Load model and scaler at startup
# ---------------------------------------------------------------------------
MODEL_PATH = os.path.join("models", "final_xgboost_model.pkl")
SCALER_PATH = os.path.join("models", "scaler.pkl")

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# Mapping from frontend BS strings to label-encoded integers (alphabetical order)
BS_MAP = {'BS1': 0, 'BS2': 1, 'BS3': 2, 'BS4': 3, 'BS5': 4}

# ---------------------------------------------------------------------------
# Database Setup
# ---------------------------------------------------------------------------
DB_PATH = 'history.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            time_value INTEGER,
            bs_station TEXT,
            load REAL,
            esmode INTEGER,
            txpower REAL,
            predicted_energy REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route('/health', methods=['GET'])
def health():
    """Simple health check endpoint."""
    return jsonify({"status": "ok"})


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict 5G base station energy consumption.

    Expected JSON body:
        {
            "time":    <int 0–23>,
            "bs":      <str "BS1"–"BS5">,
            "load":    <float 0–100>,
            "esmode":  <int 0–3>,
            "txpower": <float 0–50>
        }

    Returns:
        { "prediction": <float> }
    """
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No JSON body provided"}), 400

        # --- Input validation ---
        required_fields = ['time', 'bs', 'load', 'esmode', 'txpower']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: '{field}'"}), 400

        time_val = float(data['time'])
        bs_val = str(data['bs'])
        load_val = float(data['load'])
        esmode_val = float(data['esmode'])
        txpower_val = float(data['txpower'])

        if not (0 <= time_val <= 23):
            return jsonify({"error": "'time' must be between 0 and 23"}), 400
        if bs_val not in BS_MAP:
            return jsonify({"error": f"'bs' must be one of {list(BS_MAP.keys())}"}), 400
        if not (0 <= load_val <= 100):
            return jsonify({"error": "'load' must be between 0 and 100"}), 400
        if not (0 <= esmode_val <= 3):
            return jsonify({"error": "'esmode' must be between 0 and 3"}), 400
        if not (0 <= txpower_val <= 50):
            return jsonify({"error": "'txpower' must be between 0 and 50"}), 400

        # --- Build feature DataFrame (must match training column order) ---
        features = {
            'Time':    time_val,
            'BS':      BS_MAP[bs_val],
            'load':    load_val,
            'ESMODE':  esmode_val,
            'TXpower': txpower_val,
        }
        input_df = pd.DataFrame([features])[['Time', 'BS', 'load', 'ESMODE', 'TXpower']]

        # --- Scale features using the fitted scaler (matches training pipeline) ---
        input_scaled = scaler.transform(input_df)

        # --- Predict ---
        prediction = model.predict(input_scaled)
        pred_val = round(float(prediction[0]), 4)
        
        # --- Save to DB ---
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO predictions (time_value, bs_station, load, esmode, txpower, predicted_energy)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (time_val, bs_val, load_val, esmode_val, txpower_val, pred_val))
        conn.commit()
        conn.close()

        return jsonify({"prediction": pred_val})

    except ValueError as ve:
        return jsonify({"error": f"Invalid value: {str(ve)}"}), 400
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/history', methods=['GET'])
def history():
    """Fetch recent prediction history."""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM predictions ORDER BY created_at DESC LIMIT 10')
        rows = cursor.fetchall()
        conn.close()
        
        predictions = [dict(row) for row in rows]
        # Append "Z" so JS parses local times as UTC if needed, or JS handles local correctly?
        # SQLite CURRENT_TIMESTAMP is UTC.
        for p in predictions:
            if not p['created_at'].endswith('Z'):
                p['created_at'] = p['created_at'] + 'Z'
                
        return jsonify(predictions)
    except Exception as e:
        return jsonify({"error": "Failed to fetch history", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
