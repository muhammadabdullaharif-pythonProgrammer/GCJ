from django.test import TestCase
from rest_framework.test import APIClient

from students.models import Student, Result, Attendance, FeeRecord
from teachers.models import Course
from departments.models import Department
from accounts.models import User


class StudentCRUDTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.dept = Department.objects.create(name="CS", description="", total_seats=50)
        self.course = Course.objects.create(
            name="Intro",
            code="CS101",
            department=self.dept,
            credit_hours=3,
            semester="Fall 2024",
        )

        self.admin = User.objects.create_superuser(
            email="admin_s@gcj.edu.pk",
            name="AdminS",
            password="StrongPass123!",
        )
        self.teacher = User.objects.create_user(
            email="teacher_s@gcj.edu.pk",
            name="TeacherS",
            password="StrongPass123!",
            role="TEACHER",
        )
        self.teacher.is_email_verified = True
        self.teacher.save(update_fields=["is_email_verified"])

        from teachers.models import Teacher

        self.teacher_profile = Teacher.objects.create(
            user=self.teacher,
            designation="LECTURER",
            department=self.dept,
            qualification="PhD",
            joining_date="2020-01-01",
        )

        self.student1 = User.objects.create_user(
            email="stu1@gcj.edu.pk",
            name="Stu1",
            password="StrongPass123!",
            role="STUDENT",
        )
        self.student1.is_email_verified = True
        self.student1.save(update_fields=["is_email_verified"])
        self.s1_profile = Student.objects.create(
            user=self.student1,
            roll_no="S-2001",
            matric_marks=800,
            inter_marks=700,
            district="Jhang",
            program="BS_CS",
            admission_year=2024,
        )

        self.student2 = User.objects.create_user(
            email="stu2@gcj.edu.pk",
            name="Stu2",
            password="StrongPass123!",
            role="STUDENT",
        )
        self.student2.is_email_verified = True
        self.student2.save(update_fields=["is_email_verified"])
        self.s2_profile = Student.objects.create(
            user=self.student2,
            roll_no="S-2002",
            matric_marks=820,
            inter_marks=690,
            district="Jhang",
            program="BS_IT",
            admission_year=2024,
        )

    def _auth(self, user):
        from rest_framework_simplejwt.tokens import RefreshToken

        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_student_list_admin_success(self):
        self._auth(self.admin)
        res = self.client.get("/api/v1/students/profiles/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(res.data["count"], 2)

    def test_student_list_student_scoped_to_own_profile(self):
        self._auth(self.student1)
        res = self.client.get("/api/v1/students/profiles/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(all(item["user"] == self.s1_profile.user.id for item in res.data["results"]))

    def test_student_create_requires_admin_permission(self):
        self._auth(self.student1)
        payload = {
            "user": self.student2.id,
            "roll_no": "S-3001",
            "matric_marks": 750,
            "inter_marks": 650,
            "district": "Jhang",
            "program": "BS_CS",
            "admission_year": 2024,
        }
        res = self.client.post("/api/v1/students/profiles/", payload, format="json")
        self.assertEqual(res.status_code, 403)

    def test_student_create_success_admin(self):
        self._auth(self.admin)
        payload = {
            "user": self.student2.id,
            "roll_no": "S-3001",
            "matric_marks": 750,
            "inter_marks": 650,
            "district": "Jhang",
            "program": "BS_CS",
            "admission_year": 2024,
        }
        res = self.client.post("/api/v1/students/profiles/", payload, format="json")
        self.assertEqual(res.status_code, 201)

    def test_student_roll_no_validation_duplicate(self):
        self._auth(self.admin)
        payload = {
            "user": self.student2.id,
            "roll_no": "S-2001",  # duplicate of s1
            "matric_marks": 750,
            "inter_marks": 650,
            "district": "Jhang",
            "program": "BS_CS",
            "admission_year": 2024,
        }
        res = self.client.post("/api/v1/students/profiles/", payload, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("roll number", str(res.data).lower())

    def test_result_marks_validation(self):
        self._auth(self.admin)
        payload = {
            "student": self.s1_profile.id,
            "course": self.course.id,
            "marks_obtained": 120,
            "total_marks": 100,
            "grade": "A",
        }
        res = self.client.post("/api/v1/students/results/", payload, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("cannot exceed", str(res.data).lower())

    def test_fee_paid_requires_paid_date_validation(self):
        self._auth(self.admin)
        payload = {
            "student": self.s1_profile.id,
            "amount": "1000.00",
            "due_date": "2025-01-01",
            "status": "PAID",
            "paid_date": None,
        }
        res = self.client.post("/api/v1/students/fees/", payload, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("paid date", str(res.data).lower())

    def test_result_crud_student_scoped_and_success(self):
        self._auth(self.student1)
        r = Result.objects.create(
            student=self.s1_profile,
            course=self.course,
            marks_obtained=75,
            total_marks=100,
            grade="B",
        )
        res = self.client.get("/api/v1/students/results/", format="json")
        self.assertEqual(res.status_code, 200)
        ids = [x["id"] for x in res.data["results"]]
        self.assertIn(r.id, ids)

    def test_attendance_student_cannot_access_other_student(self):
        self._auth(self.student1)
        Attendance.objects.create(student=self.s2_profile, course=self.course, date="2024-10-10", status="PRESENT")
        res = self.client.get("/api/v1/students/attendance/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["count"], 0)

