import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB

# Paths
DATA_PATH = 'd:/GCJ/gcj_website/ai_engine/data/students_dataset.csv'
MODEL_DIR = 'd:/GCJ/gcj_website/ai_engine/models'
os.makedirs(MODEL_DIR, exist_ok=True)


def train_and_evaluate():
    # Read dataset
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATA_PATH}. Run dataset_generator.py first.")

    df = pd.read_csv(DATA_PATH)

    # Encode categorical fields
    encoders = {}
    categorical_cols = ['district', 'subjects_combo', 'career_interest']
    
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le

    # Also encode label recommended_dept
    le_dept = LabelEncoder()
    df['recommended_dept'] = le_dept.fit_transform(df['recommended_dept'])
    encoders['recommended_dept'] = le_dept

    # Features and Labels
    X = df[['matric_marks', 'inter_marks', 'age', 'district', 'subjects_combo', 'career_interest']]
    y = df['recommended_dept']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Models list
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "Naive Bayes": GaussianNB()
    }

    best_model_name = None
    best_accuracy = 0
    best_model = None

    print(f"{'Model':<25} | {'Accuracy':<10} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10}")
    print("-" * 75)

    for name, clf in models.items():
        # Fit model
        clf.fit(X_train, y_train)
        y_pred = clf.predict(X_test)
        
        # Calculate metrics
        acc = accuracy_score(y_test, y_pred)
        precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted', zero_division=0)
        
        print(f"{name:<25} | {acc:<10.4f} | {precision:<10.4f} | {recall:<10.4f} | {f1:<10.4f}")
        
        if acc > best_accuracy:
            best_accuracy = acc
            best_model_name = name
            best_model = clf

    print(f"\nBest Model: {best_model_name} with Accuracy {best_accuracy:.4f}")

    # Save best model
    with open(os.path.join(MODEL_DIR, 'admission_model.pkl'), 'wb') as f:
        pickle.dump(best_model, f)

    # Save encoders
    with open(os.path.join(MODEL_DIR, 'encoders.pkl'), 'wb') as f:
        pickle.dump(encoders, f)

    print("Model and Encoders saved successfully.")


if __name__ == "__main__":
    train_and_evaluate()
