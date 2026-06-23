from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import User
from departments.models import Department
from students.models import Student
from admissions.models import Admission


class AdmissionsTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.dept_cs = Department.objects.create(name="CS", description="", total_seats=50)
        self.dept_it = Department.objects.create(name="IT", description="", total_seats=50)

        self.admin = User.objects.create_superuser(
            email="adm@gcj.edu.pk",
            name="Adm",
            password="StrongPass123!",
        )

        self.teacher_user = User.objects.create_user(
            email="teach_a@gcj.edu.pk",
            name="TeachA",
            password="StrongPass123!",
            role="TEACHER",
        )
        self.teacher_user.is_email_verified = True
        self.teacher_user.save(update_fields=["is_email_verified"])

        from teachers.models import Teacher

        self.teacher = Teacher.objects.create(
            user=self.teacher_user,
            designation="LECTURER",
            department=self.dept_cs,
            qualification="PhD",
            joining_date="2020-01-01",
        )

        self.student_user = User.objects.create_user(
            email="stud_a@gcj.edu.pk",
            name="StudA",
            password="StrongPass123!",
            role="STUDENT",
        )
        self.student_user.is_email_verified = True
        self.student_user.save(update_fields=["is_email_verified"])

        self.student = Student.objects.create(
            user=self.student_user,
            roll_no="S-4001",
            matric_marks=850,
            inter_marks=780,
            district="Jhang",
            program="BS_CS",
            admission_year=2024,
        )

    def _auth(self, user):
        from rest_framework_simplejwt.tokens import RefreshToken

        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_admission_create_student_success_and_merit_score_computed(self):
        self._auth(self.student_user)
        payload = {
            "student": self.student.id,
            "department": self.dept_cs.id,
            "status": "PENDING",
        }
        res = self.client.post("/api/v1/admissions/", payload, format="json")
        self.assertEqual(res.status_code, 201)
        admission = Admission.objects.get(pk=res.data["id"])
        self.assertAlmostEqual(
            admission.merit_score,
            round((850 / 1100.0 * 40.0) + (780 / 1100.0 * 60.0), 2),
        )

    def test_admission_create_student_validation_missing_student_400(self):
        self._auth(self.student_user)
        payload = {"department": self.dept_cs.id, "status": "PENDING"}
        res = self.client.post("/api/v1/admissions/", payload, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("Student record is required", str(res.data))

    def test_admission_queryset_scoped_to_student(self):
        # Create admission for this student
        Admission.objects.create(
            student=self.student,
            department=self.dept_cs,
            status="PENDING",
            merit_score=10.0,
        )

        # Create another student admission
        other_user = User.objects.create_user(
            email="stud_other@gcj.edu.pk",
            name="Other",
            password="StrongPass123!",
            role="STUDENT",
        )
        other_user.is_email_verified = True
        other_user.save(update_fields=["is_email_verified"])
        other_student = Student.objects.create(
            user=other_user,
            roll_no="S-4002",
            matric_marks=800,
            inter_marks=700,
            district="Jhang",
            program="BS_IT",
            admission_year=2024,
        )
        Admission.objects.create(
            student=other_student,
            department=self.dept_it,
            status="PENDING",
            merit_score=20.0,
        )

        self._auth(self.student_user)
        res = self.client.get("/api/v1/admissions/", format="json")
        self.assertEqual(res.status_code, 200)
        returned_student_ids = {x["student"] for x in res.data["results"]}
        self.assertEqual(returned_student_ids, {self.student.id})

    def test_status_update_permission_only_admin_teacher(self):
        # Create admission
        admission = Admission.objects.create(
            student=self.student,
            department=self.dept_cs,
            status="PENDING",
            merit_score=10.0,
        )

        # Student tries to update
        self._auth(self.student_user)
        res = self.client.patch(
            f"/api/v1/admissions/{admission.id}/",
            {"status": "APPROVED"},
            format="json",
        )
        self.assertEqual(res.status_code, 403)

        # Admin updates
        self._auth(self.admin)
        res2 = self.client.patch(
            f"/api/v1/admissions/{admission.id}/",
            {"status": "APPROVED"},
            format="json",
        )
        self.assertEqual(res2.status_code, 200)
        self.assertEqual(Admission.objects.get(pk=admission.id).status, "APPROVED")

