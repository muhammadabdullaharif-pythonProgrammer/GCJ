import csv
import random
import os

# Create dataset folder
os.makedirs('d:/GCJ/gcj_website/ai_engine/data', exist_ok=True)

# Dataset path
CSV_PATH = 'd:/GCJ/gcj_website/ai_engine/data/students_dataset.csv'

# Options
DISTRICTS = ['Jhang', 'Chiniot', 'Faisalabad', 'Sargodha', 'Toba Tek Singh', 'Jhang Rural']
SUBJECT_COMBOS = ['ICS_PHYSICS', 'ICS_STATS', 'FSC_PRE_ENG', 'FSC_PRE_MED', 'FA_HUMANITIES', 'ICOM']
CAREER_INTERESTS = ['Software Engineer', 'Data Scientist', 'Doctor', 'Mechanical Engineer', 'Teacher', 'Banker', 'Civil Servant']
DEPARTMENTS = ['Computer Science', 'Information Technology', 'Mathematics', 'Biology', 'English', 'Commerce']


def generate_dataset(num_records=5000):
    with open(CSV_PATH, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['matric_marks', 'inter_marks', 'age', 'district', 'subjects_combo', 'career_interest', 'merit_score', 'eligible', 'recommended_dept'])

        for _ in range(num_records):
            matric_marks = random.randint(600, 1100)
            inter_marks = random.randint(600, 1100)
            age = random.randint(17, 22)
            district = random.choice(DISTRICTS)
            subjects_combo = random.choice(SUBJECT_COMBOS)
            career_interest = random.choice(CAREER_INTERESTS)
            
            # Merit formula: 40% matric + 60% inter
            merit_score = round(((matric_marks / 1100.0) * 40.0) + ((inter_marks / 1100.0) * 60.0), 2)
            
            # Eligibility criteria: Merit score >= 60%
            eligible = 1 if merit_score >= 60.0 else 0
            
            # Recommended department logic (based on combo & career interest)
            if subjects_combo in ['ICS_PHYSICS', 'ICS_STATS'] and career_interest in ['Software Engineer', 'Data Scientist']:
                recommended_dept = 'Computer Science' if merit_score >= 70 else 'Information Technology'
            elif subjects_combo == 'FSC_PRE_ENG' and career_interest == 'Mechanical Engineer':
                recommended_dept = 'Mathematics'
            elif subjects_combo == 'FSC_PRE_MED' and career_interest == 'Doctor':
                recommended_dept = 'Biology'
            elif subjects_combo == 'ICOM' or career_interest == 'Banker':
                recommended_dept = 'Commerce'
            else:
                recommended_dept = 'English'

            writer.writerow([matric_marks, ...]) # Wait, write the values properly
            writer.writerow([matric_marks, inter_marks, age, district, subjects_combo, career_interest, merit_score, eligible, recommended_dept])

    print(f"Dataset generated at {CSV_PATH}")

if __name__ == "__main__":
    generate_dataset()
