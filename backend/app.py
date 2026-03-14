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
        return jsonify({"prediction": round(float(prediction[0]), 4)})

    except ValueError as ve:
        return jsonify({"error": f"Invalid value: {str(ve)}"}), 400
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
