import os
import urllib.request
import pandas as pd
import numpy as np

DATASET_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(DATASET_DIR, 'pcos_dataset.csv')

def download_dataset():
    print("Searching for PCOS dataset...")
    # Using a known public PCOS dataset URL (or a synthetic generator if unavailable)
    url = "https://raw.githubusercontent.com/amrmaksouk/PCOS-Predictor/main/PCOS_data_without_infertility.csv"
    
    try:
        print(f"Downloading from {url}...")
        user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        req = urllib.request.Request(url, headers={'User-Agent': user_agent})
        with urllib.request.urlopen(req) as response, open(DATASET_PATH, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print("Dataset downloaded successfully.")
        
        # We need to map the downloaded dataset to the features our app expects:
        # Expected: Age, BMI, Cycle Regularity, Acne, Hair Loss, Weight Gain, Sleep Hours, Stress Level, Exercise Frequency, Family History of PCOS
        print("Preprocessing raw dataset to match application features...")
        df = pd.read_csv(DATASET_PATH)
        
        # Create a synthetic-augmented dataset based on the real one to guarantee 
        # all required assessment fields are present and well-formatted for our predictor.
        n_samples = max(len(df), 500)
        
        # We will build a clean dataframe
        clean_df = pd.DataFrame()
        
        # Real features if available, otherwise synthetic distributions
        # Age
        clean_df['Age'] = df['Age (yrs)'] if 'Age (yrs)' in df.columns else np.random.randint(18, 45, n_samples)
        # BMI
        clean_df['BMI'] = df['BMI'] if 'BMI' in df.columns else np.random.normal(25, 5, n_samples)
        
        # Cycle Regularity (1: Regular, 0: Irregular) - Using Cycle(months) or Cycle length(days)
        if 'Cycle(R/I)' in df.columns:
            clean_df['Cycle_Regularity'] = df['Cycle(R/I)'].apply(lambda x: 1 if x == 2 else 0) # 2 usually means regular in this specific dataset
        else:
            clean_df['Cycle_Regularity'] = np.random.choice([0, 1], p=[0.4, 0.6], size=n_samples)
            
        clean_df['Acne'] = df['Pimples(Y/N)'] if 'Pimples(Y/N)' in df.columns else np.random.choice([0, 1], size=n_samples)
        clean_df['Hair_Loss'] = df['Hair loss(Y/N)'] if 'Hair loss(Y/N)' in df.columns else np.random.choice([0, 1], size=n_samples)
        clean_df['Weight_Gain'] = df['Weight gain(Y/N)'] if 'Weight gain(Y/N)' in df.columns else np.random.choice([0, 1], size=n_samples)
        
        # Synthetic fields for ones usually missing in standard medical datasets but asked in our app
        clean_df['Sleep_Hours'] = np.random.normal(7, 1.5, n_samples).clip(4, 10)
        clean_df['Stress_Level'] = np.random.choice(['Low', 'Medium', 'High'], p=[0.3, 0.4, 0.3], size=n_samples)
        clean_df['Exercise_Frequency'] = np.random.choice(['Never', '1-2 times', '3+ times'], p=[0.4, 0.4, 0.2], size=n_samples)
        clean_df['Family_History'] = np.random.choice([0, 1], p=[0.8, 0.2], size=n_samples)
        
        # Target variable (PCOS Y/N)
        if 'PCOS (Y/N)' in df.columns:
            clean_df['PCOS'] = df['PCOS (Y/N)']
        else:
            # Synthetic target based on logic
            risk_score = (
                (clean_df['Cycle_Regularity'] == 0).astype(int) * 3 +
                clean_df['Acne'] * 1 +
                clean_df['Hair_Loss'] * 1 +
                clean_df['Weight_Gain'] * 2 +
                (clean_df['BMI'] > 25).astype(int) * 1 +
                clean_df['Family_History'] * 2
            )
            clean_df['PCOS'] = (risk_score >= 4).astype(int)
            
        # Clean and save
        clean_df.fillna(clean_df.median(numeric_only=True), inplace=True)
        clean_df.to_csv(DATASET_PATH, index=False)
        print(f"Dataset prepared and saved to {DATASET_PATH}")
        
    except Exception as e:
        print(f"Error downloading/processing dataset: {e}")
        print("Falling back to generating a fully synthetic dataset...")
        generate_synthetic_dataset()

def generate_synthetic_dataset():
    np.random.seed(42)
    n_samples = 1000
    
    df = pd.DataFrame({
        'Age': np.random.randint(18, 45, n_samples),
        'BMI': np.random.normal(25, 6, n_samples).clip(15, 45),
        'Cycle_Regularity': np.random.choice([0, 1], p=[0.3, 0.7], size=n_samples), # 0: Irregular, 1: Regular
        'Acne': np.random.choice([0, 1], p=[0.6, 0.4], size=n_samples),
        'Hair_Loss': np.random.choice([0, 1], p=[0.7, 0.3], size=n_samples),
        'Weight_Gain': np.random.choice([0, 1], p=[0.5, 0.5], size=n_samples),
        'Sleep_Hours': np.random.normal(7, 1.5, n_samples).clip(3, 12),
        'Stress_Level': np.random.choice(['Low', 'Medium', 'High'], size=n_samples),
        'Exercise_Frequency': np.random.choice(['Never', '1-2 times', '3+ times'], size=n_samples),
        'Family_History': np.random.choice([0, 1], p=[0.8, 0.2], size=n_samples),
    })
    
    # Generate realistic target based on typical PCOS indicators
    risk_score = (
        (df['Cycle_Regularity'] == 0).astype(int) * 4 +
        df['Acne'] * 1.5 +
        df['Hair_Loss'] * 1.5 +
        df['Weight_Gain'] * 2 +
        (df['BMI'] > 25).astype(int) * 1.5 +
        df['Family_History'] * 2.5 +
        (df['Stress_Level'] == 'High').astype(int) * 1 +
        (df['Sleep_Hours'] < 6).astype(int) * 1 -
        (df['Exercise_Frequency'] == '3+ times').astype(int) * 1
    )
    
    df['PCOS'] = (risk_score >= 6).astype(int)
    
    df.to_csv(DATASET_PATH, index=False)
    print(f"Synthetic dataset saved to {DATASET_PATH}")

if __name__ == "__main__":
    download_dataset()
