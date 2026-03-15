import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
import joblib

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(MODEL_DIR, 'dataset', 'pcos_dataset.csv')
MODEL_PATH = os.path.join(MODEL_DIR, 'pcos_model.pkl')

def train():
    if not os.path.exists(DATASET_PATH):
        print(f"Dataset not found at {DATASET_PATH}. Please run download_dataset.py first.")
        return

    print("Loading dataset...")
    df = pd.read_csv(DATASET_PATH)

    # Features and Target
    X = df.drop(columns=['PCOS'])
    y = df['PCOS']

    # Define categorical and numerical features
    categorical_features = ['Stress_Level', 'Exercise_Frequency']
    numerical_features = ['Age', 'BMI', 'Cycle_Regularity', 'Acne', 'Hair_Loss', 'Weight_Gain', 'Sleep_Hours', 'Family_History']

    # Preprocessing pipelines
    numeric_transformer = Pipeline(steps=[
        ('scaler', StandardScaler())
    ])

    # We use mapping for known categoricals to ensure consistency during prediction
    # Or simple manual mapping inside the script before sklearn to avoid complex ColumnTransformer states
    df['Stress_Level'] = df['Stress_Level'].map({'Low': 0, 'Medium': 1, 'High': 2}).fillna(1)
    df['Exercise_Frequency'] = df['Exercise_Frequency'].map({'Never': 0, '1-2 times': 1, '3+ times': 2}).fillna(0)
    
    # Redefine X after manual mapping
    X = df.drop(columns=['PCOS'])

    # Train Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Build and train model
    print("Training Random Forest Classifier...")
    model = Pipeline(steps=[
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'))
    ])

    model.fit(X_train, y_train)

    # Evaluate
    score = model.score(X_test, y_test)
    print(f"Model accuracy on test set: {score:.4f}")

    # Save model
    joblib.dump(model, MODEL_PATH)
    print(f"Model successfully saved to {MODEL_PATH}")

if __name__ == "__main__":
    train()
