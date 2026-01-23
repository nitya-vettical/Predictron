import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

def load_and_preprocess_data(filepath):
    # Load dataset
    data = pd.read_csv(filepath)
    
    # Encode categorical features
    le = LabelEncoder()
    data['BS'] = le.fit_transform(data['BS'])

    # Convert Time into numeric (we can later extract hour/day)
    data['Time'] = pd.to_numeric(data['Time'], errors='coerce')

    # Define features and target
    X = data[['Time', 'BS', 'load', 'ESMODE', 'TXpower']]
    y = data['Energy']

    # Split into train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Scale features for better ML performance
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    return X_train_scaled, X_test_scaled, y_train, y_test, scaler