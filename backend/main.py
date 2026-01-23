
"""import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns


data = pd.read_csv("data/5G_energy.csv") 

print("Shape of dataset:", data.shape)
print("\nFirst 5 rows:")
print(data.head())

print("\nSummary:")
print(data.describe())

print("\nMissing values per column:")
print(data.isnull().sum())

sns.pairplot(data)
plt.show()
"""

from preprocess import load_and_preprocess_data
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

# Ensure model directory exists
os.makedirs("models", exist_ok=True)

# Load data
X_train, X_test, y_train, y_test, scaler = load_and_preprocess_data("data/5G_energy.csv")

# Initialize final model
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

# Predict
y_pred = model.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, y_pred)
rmse = mse ** 0.5

r2 = r2_score(y_test, y_pred)

print(f"\nModel Performance:")
print(f"RMSE: {rmse:.3f}")
print(f"R² Score: {r2:.3f}")

# Save model
joblib.dump(model, "models/final_xgboost_model.pkl")
print("\nModel saved as 'models/final_xgboost_model.pkl'")





