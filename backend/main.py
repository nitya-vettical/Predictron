"""
main.py – Train and save the XGBoost energy consumption prediction model.

Usage:
    python main.py

Outputs:
    models/final_xgboost_model.pkl  – Trained XGBoost regressor
    models/scaler.pkl               – StandardScaler fitted on training data
"""

from preprocess import load_and_preprocess_data
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

# Ensure model directory exists
os.makedirs("models", exist_ok=True)

# Load and preprocess data
X_train, X_test, y_train, y_test, scaler = load_and_preprocess_data("data/5G_energy.csv")

# Initialize XGBoost model with tuned hyperparameters
model = XGBRegressor(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)

print("\nTraining XGBoost model...")
model.fit(X_train, y_train)

# Evaluate on test set
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = mse ** 0.5
r2 = r2_score(y_test, y_pred)

print(f"\nModel Performance:")
print(f"  RMSE    : {rmse:.4f}")
print(f"  R² Score: {r2:.4f}")

# Save model and scaler (both required for correct inference)
joblib.dump(model, "models/final_xgboost_model.pkl")
joblib.dump(scaler, "models/scaler.pkl")
print("\nSaved: models/final_xgboost_model.pkl")
print("Saved: models/scaler.pkl")
