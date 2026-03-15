# Predictron 🔋

> **AI-powered 5G base station energy consumption forecasting**

Predictron predicts the energy consumption (in Watts) of a 5G base station based on network parameters such as time, load, energy saving mode, and transmission power — using a trained **XGBoost** regression model served via a **Flask** REST API and a **React + TypeScript** frontend.

---

## 🎯 Features

- Predict 5G energy consumption in real-time using ML
- Interactive parameter sliders and dropdowns
- Network activity visualization (Canvas-based)
- Model Insights: Global feature importance (Explainable AI)
- Prediction history via Supabase (optional)
- Efficiency rating and daily/monthly energy estimates

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, TypeScript, Vite, TailwindCSS |
| ML Model  | XGBoost Regressor (scikit-learn pipeline) |
| Backend   | Python, Flask, Flask-CORS           |
| Database  | Supabase (PostgreSQL) — optional    |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────┐
│           React Frontend (Vite)         │
│  PredictionForm → POST /predict         │
└──────────────────┬──────────────────────┘
                   │ JSON
┌──────────────────▼──────────────────────┐
│         Flask REST API (app.py)         │
│  /health   /predict                     │
│  Loads model.pkl + scaler.pkl           │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│   XGBoost Model (models/)               │
│   final_xgboost_model.pkl  scaler.pkl   │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Train the model (generates model + scaler .pkl files)
python main.py

# Start the API server
python app.py
# → Running on http://127.0.0.1:5000
```

### 2. Frontend

```bash
cd frontend

# Copy and configure environment variables
copy .env.example .env
# Edit .env and set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (optional)

# Install dependencies
npm install

# Start the dev server
npm run dev
# → Running on http://localhost:5173
```

---

## 📁 Project Structure

```
Predictron/
├── backend/
│   ├── app.py              # Flask API with /health and /predict endpoints
│   ├── main.py             # Model training script
│   ├── preprocess.py       # Data loading and feature engineering
│   ├── requirements.txt    # Python dependencies
│   └── models/
│       ├── final_xgboost_model.pkl
│       └── scaler.pkl
├── frontend/
│   ├── src/
│   │   ├── App.tsx                     # Root component
│   │   ├── components/
│   │   │   ├── PredictionForm.tsx      # Input form
│   │   │   ├── PredictionResult.tsx    # Result display card
│   │   │   ├── PredictionHistory.tsx   # Supabase history table
│   │   │   ├── NetworkVisualization.tsx# Canvas animation
│   │   │   └── InfoCards.tsx           # Feature highlights
│   │   └── lib/
│   │       └── supabase.ts             # Supabase client
│   ├── .env.example                    # Environment variable template
│   └── package.json
└── README.md
```

---

## 🔌 API Reference

### `GET /health`
Returns API status.

```json
{ "status": "ok" }
```

### `POST /predict`
Returns predicted energy consumption in Watts.

**Request body:**
```json
{
  "time":    12,
  "bs":      "BS1",
  "load":    50.0,
  "esmode":  1,
  "txpower": 25.0
}
```

**Response:**
```json
{ "prediction": 97.4321 }
```

**Field constraints:**
| Field    | Type   | Range       |
|----------|--------|-------------|
| time     | int    | 0 – 23      |
| bs       | string | BS1 – BS5   |
| load     | float  | 0 – 100     |
| esmode   | int    | 0 – 3       |
| txpower  | float  | 0 – 50      |

---

## 📝 Notes

- The `models/` directory and `.env` are excluded from version control (see `.gitignore`).
- Run `python main.py` any time to retrain the model from scratch.
- Supabase integration is **optional** — the prediction feature works without it.
