import sys
import json
import os
import joblib

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, 'pcos_model.pkl')

def predict():
    try:
        input_data = sys.stdin.read()
        if not input_data:
            raise ValueError("No input data provided")
        
        data = json.loads(input_data)
        
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

        model = joblib.load(MODEL_PATH)

        # Expected features matching training setup:
        # Age, BMI, Cycle_Regularity, Acne, Hair_Loss, Weight_Gain, Sleep_Hours, Family_History
        # + mapped: Stress_Level, Exercise_Frequency
        
        # Mapping helpers
        cycle_reg = 1 if 'regular' in str(data.get('Cycle_Regularity', '')).lower() and 'irregular' not in str(data.get('Cycle_Regularity', '')).lower() else 0
        acne = 1 if str(data.get('Acne', 'false')).lower() == 'true' else 0
        hair_loss = 1 if str(data.get('Hair_Loss', 'false')).lower() == 'true' else 0
        weight_gain = 1 if str(data.get('Weight_Gain', 'false')).lower() == 'true' else 0
        fam_history = 1 if str(data.get('Family_History', 'no')).lower() == 'yes' else 0
        
        stress_val = str(data.get('Stress_Level', 'Medium')).capitalize()
        stress_mapped = {'Low': 0, 'Medium': 1, 'High': 2}.get(stress_val, 1)

        ex_val = str(data.get('Exercise_Frequency', 'Never'))
        ex_mapped = {'Never': 0, '1-2 times': 1, '3+ times': 2}.get(ex_val, 0)
        
        # Build DataFrame for prediction
        import pandas as pd
        X = pd.DataFrame([{
            'Age': float(data.get('Age', 25)),
            'BMI': float(data.get('BMI', 22.0)),
            'Cycle_Regularity': cycle_reg,
            'Acne': acne,
            'Hair_Loss': hair_loss,
            'Weight_Gain': weight_gain,
            'Sleep_Hours': float(data.get('Sleep_Hours', 7.0)),
            'Stress_Level': stress_mapped,
            'Exercise_Frequency': ex_mapped,
            'Family_History': fam_history
        }])

        prediction = model.predict(X)[0]
        probabilities = model.predict_proba(X)[0]
        
        # Output structure
        risk_score = probabilities[1] # Probability of class 1 (PCOS)
        
        if risk_score >= 0.65:
            risk_level = "High"
        elif risk_score >= 0.35:
            risk_level = "Moderate"
        else:
            risk_level = "Low"

        output = {
            "riskLevel": risk_level,
            "confidence": float(risk_score)
        }
        
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    predict()
