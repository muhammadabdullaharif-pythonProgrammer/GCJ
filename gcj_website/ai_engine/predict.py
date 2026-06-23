import pickle
import os
import numpy as np

MODEL_DIR = 'd:/GCJ/gcj_website/ai_engine/models'
MODEL_PATH = os.path.join(MODEL_DIR, 'admission_model.pkl')
ENCODERS_PATH = os.path.join(MODEL_DIR, 'encoders.pkl')

# Cache model and encoders in memory
_model = None
_encoders = None


def load_model_and_encoders():
    global _model, _encoders
    if _model is None or _encoders is None:
        if not os.path.exists(MODEL_PATH) or not os.path.exists(ENCODERS_PATH):
            raise FileNotFoundError("Trained model or encoders not found. Run train_models.py first.")
        
        with open(MODEL_PATH, 'rb') as f:
            _model = pickle.load(f)
        with open(ENCODERS_PATH, 'rb') as f:
            _encoders = pickle.load(f)
            
    return _model, _encoders


def predict_admission(student_data_dict):
    """
    predict_admission(student_data_dict) -> returns {eligible, dept, probability, advice}
    
    student_data_dict format:
    {
        'matric_marks': int,
        'inter_marks': int,
        'age': int,
        'district': str,
        'subjects_combo': str,
        'career_interest': str
    }
    """
    # Load assets
    try:
        model, encoders = load_model_and_encoders()
    except FileNotFoundError:
        # Fallback if model files are not trained/saved yet
        return _rules_fallback(student_data_dict)

    try:
        # 1. Deterministic Merit Score and Eligibility Check
        matric = float(student_data_dict.get('matric_marks', 0))
        inter = float(student_data_dict.get('inter_marks', 0))
        merit_score = (matric / 1100.0 * 40.0) + (inter / 1100.0 * 60.0)
        eligible = int(merit_score >= 60.0)

        # 2. Encode categorical input
        def safe_encode(col_name, value):
            le = encoders.get(col_name)
            if not le:
                return 0
            # If value is not in classes, use the first class or default
            if value not in le.classes_:
                return 0
            return int(le.transform([value])[0])

        encoded_district = safe_encode('district', student_data_dict.get('district', ''))
        encoded_combo = safe_encode('subjects_combo', student_data_dict.get('subjects_combo', ''))
        encoded_career = safe_encode('career_interest', student_data_dict.get('career_interest', ''))

        # 3. Predict department
        features = np.array([[
            matric,
            inter,
            int(student_data_dict.get('age', 18)),
            encoded_district,
            encoded_combo,
            encoded_career
        ]])

        predicted_class_encoded = model.predict(features)[0]
        
        # Get probability
        probabilities = model.predict_proba(features)[0]
        probability = float(probabilities[predicted_class_encoded])

        # Decode predicted class
        le_dept = encoders.get('recommended_dept')
        recommended_dept = str(le_dept.inverse_transform([predicted_class_encoded])[0])

        # Generate custom advice
        if eligible:
            advice = f"Congratulations! You meet the GCJ eligibility criteria with a merit score of {round(merit_score, 2)}%. We recommend enrolling in '{recommended_dept}'."
        else:
            advice = f"Your merit score of {round(merit_score, 2)}% is below the required 60% minimum cutoff for standard admissions. You may apply for evening programs or humanities courses."

        return {
            "eligible": bool(eligible),
            "dept": recommended_dept,
            "probability": round(probability, 4),
            "advice": advice
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        return _rules_fallback(student_data_dict)


def _rules_fallback(student_data_dict):
    matric = float(student_data_dict.get('matric_marks', 0))
    inter = float(student_data_dict.get('inter_marks', 0))
    merit_score = (matric / 1100.0 * 40.0) + (inter / 1100.0 * 60.0)
    eligible = merit_score >= 60.0

    combo = student_data_dict.get('subjects_combo', '')
    if 'ICS' in combo:
        dept = 'Computer Science'
    elif 'FSC_PRE_MED' in combo:
        dept = 'Biology'
    elif 'ICOM' in combo:
        dept = 'Commerce'
    else:
        dept = 'English'

    return {
        "eligible": eligible,
        "dept": dept,
        "probability": 0.85,
        "advice": f"[Rules-Based Fallback] Merit score: {round(merit_score, 2)}%. Recommended department based on subject combinations: {dept}."
    }
