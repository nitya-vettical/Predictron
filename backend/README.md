# Predictron Backend

Flask REST API serving the XGBoost 5G energy prediction model.

## Setup

```bash
# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt
```

## Train the Model

Run this once before starting the API (or any time you want to retrain):

```bash
python main.py
```

This reads `data/5G_energy.csv`, trains the XGBoost model, evaluates it, and writes:
- `models/final_xgboost_model.pkl` — the trained regressor
- `models/scaler.pkl` — the fitted StandardScaler (required for correct predictions)

## Run the API

```bash
python app.py
# → http://127.0.0.1:5000
```

## Endpoints

| Method | Path       | Description              |
|--------|------------|--------------------------|
| GET    | `/health`  | API health check         |
| POST   | `/predict` | Predict energy (Watts)   |

### POST `/predict` — Example

```bash
curl -X POST http://127.0.0.1:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"time": 12, "bs": "BS1", "load": 50, "esmode": 1, "txpower": 25}'
```

Response:
```json
{ "prediction": 97.4321 }
```

## File Overview

| File             | Purpose                                    |
|------------------|--------------------------------------------|
| `app.py`         | Flask API — loads model+scaler, handles routes |
| `main.py`        | Training script — saves model+scaler       |
| `preprocess.py`  | Data loading, encoding, scaling, splitting |
| `requirements.txt` | Python dependencies                      |
| `models/`        | Saved `.pkl` artifacts (git-ignored)       |
