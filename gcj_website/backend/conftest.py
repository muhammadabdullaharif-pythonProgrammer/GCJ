import pytest
from django.contrib.auth import get_user_model
from django.test.utils import override_settings

from rest_framework_simplejwt.tokens import RefreshToken

from departments.models import Department
from students.models import Student
from teachers.models import Teacher, Course
from admissions.models import Admission
from chatbot.models import ChatbotLog
from ai_engine.models import AIPrediction


User = get_user_model()


@pytest.fixture
def api_client():
    from rest_framework.test import APIClient

    return APIClient()


# Force SQLite for tests so we don't require a running MySQL instance.
# This is applied in tests via a fixture that can be used implicitly.
@pytest.fixture(autouse=True, scope="session")
def _force_sqlite_db_settings():
    with override_settings(
        DATABASES={
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": ":memory:",
            }
        }
    ):
        yield



@pytest.fixture
def admin_user(db):
    return User.objects.create_superuser(
        email='admin@gcj.edu.pk',
        name='Admin',
        password='StrongPass123!',
    )


@pytest.fixture
def teacher_user(db):
    user = User.objects.create_user(
        email='teacher@gcj.edu.pk',
        name='Teacher',
        password='StrongPass123!',
        role='TEACHER',
    )
    user.is_email_verified = True
    user.save(update_fields=['is_email_verified'])

    dept = Department.objects.create(
        name='Computer Science',
        description='CS Department',
        total_seats=50,
    )

    Teacher.objects.create(
        user=user,
        designation='LECTURER',
        department=dept,
        qualification='PhD',
        joining_date='2020-01-01',
    )

    return user


@pytest.fixture
def student_user(db):
    user = User.objects.create_user(
        email='student@gcj.edu.pk',
        name='Student',
        password='StrongPass123!',
        role='STUDENT',
    )
    user.is_email_verified = True
    user.save(update_fields=['is_email_verified'])

    # Student profile needs a department/course only via admissions/ai tests.
    Student.objects.create(
        user=user,
        roll_no='S-1001',
        matric_marks=850,
        inter_marks=780,
        district='Jhang',
        program='BS_CS',
        admission_year=2024,
    )
    return user


@pytest.fixture
def auth_tokens(admin_user, teacher_user, student_user):
    def token_for(u):
        refresh = RefreshToken.for_user(u)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }

    return {
        'admin': token_for(admin_user),
        'teacher': token_for(teacher_user),
        'student': token_for(student_user),
    }


@pytest.fixture
def department(db):
    return Department.objects.create(
        name='Admissions Department',
        description='Admissions',
        total_seats=120,
    )


@pytest.fixture
def teacher_and_course(db, teacher_user, department):
    # Ensure teacher has a department and create at least one course.
    teacher_profile = Teacher.objects.get(user=teacher_user)
    teacher_profile.department = department
    teacher_profile.save(update_fields=['department'])

    course = Course.objects.create(
        name='Intro to Programming',
        code='CS101',
        department=department,
        credit_hours=3,
        semester='Fall 2024',
    )
    return course


@pytest.fixture
def student_profile(db, student_user):
    return Student.objects.get(user=student_user)


@pytest.fixture
def admission_record(db, student_profile, department):
    # Create minimal admission.
    # merit_score computed in serializer normally; for model instance use serializer-like computation.
    matric = student_profile.matric_marks
    inter = student_profile.inter_marks
    merit = (matric / 1100.0 * 40.0) + (inter / 1100.0 * 60.0)

    return Admission.objects.create(
        student=student_profile,
        department=department,
        status='PENDING',
        merit_score=round(merit, 2),
    )


@pytest.fixture
def chatbot_session_and_log(db, student_user):
    session_id = 'sess-1'
    log = ChatbotLog.objects.create(
        user=student_user,
        session_id=session_id,
        message='Hello',
        response='Hi!',
    )
    return session_id, log


@pytest.fixture
def ai_prediction_record(db, student_profile):
    return AIPrediction.objects.create(
        student=student_profile,
        prediction_type='ELIGIBILITY',
        input_json={'matric_marks': 850},
        output_json={'advice': 'Rules-based', 'probability': 0.88},
        model_used='rules-fallback',
        confidence_score=0.88,
    )

