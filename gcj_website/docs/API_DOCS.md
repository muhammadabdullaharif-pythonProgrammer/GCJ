# GCJ Official Website - API Reference (v1)

Base URL (typical):
- `https://gcj.example.com/api/v1/`

Authentication:
- Most endpoints require **JWT** via `Authorization: Bearer <access_token>`.

Common pagination:
- Many list endpoints use `page` + `page_size`.
- Default `page_size=20`, max `100`.

## 1) Authentication

### 1.1 Register
- **POST** `/api/auth/register/`

Request body:
```json
{
  "name": "Muhammad Ali",
  "email": "ali@example.com",
  "password": "securepassword",
  "role": "STUDENT"
}
```

Response (201):
```json
{
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": {
    "id": 1,
    "name": "Muhammad Ali",
    "email": "ali@example.com",
    "role": "STUDENT",
    "is_active": true
  }
}
```

### 1.2 Verify Email
- **GET** `/api/auth/verify-email/?token=<token>`

Response (200):
```json
{ "message": "Email verified successfully. You can now log in." }
```

### 1.3 Login (Obtain JWT)
- **POST** `/api/auth/login/`

Rate limited: `5/min` per IP.

Request body:
```json
{ "email": "ali@example.com", "password": "securepassword" }
```

Response (200):
```json
{
  "refresh": "<refresh_jwt>",
  "access": "<access_jwt>",
  "user": {
    "id": 1,
    "name": "Muhammad Ali",
    "email": "ali@example.com",
    "role": "STUDENT",
    "is_active": true
  }
}
```

### 1.4 Logout (Blacklist refresh token)
- **POST** `/api/auth/logout/`

Request body:
```json
{ "refresh": "<refresh_jwt>" }
```

Response (200):
```json
{ "message": "Successfully logged out." }
```

### 1.5 Refresh Access Token
- **POST** `/api/auth/token/refresh/`

Request body:
```json
{ "refresh": "<refresh_jwt>" }
```

Response (200):
```json
{ "access": "<new_access_jwt>", "refresh": "<refresh_jwt>" }
```

### 1.6 Profile (Get current user)
- **GET** `/api/auth/profile/`

Response (200):
```json
{
  "id": 1,
  "name": "Muhammad Ali",
  "email": "ali@example.com",
  "role": "STUDENT",
  "is_active": true
}
```

### 1.7 Profile Update
- **PUT** `/api/auth/profile/update/`

Request body (partial fields supported):
```json
{ "name": "New Name" }
```

Response (200):
```json
{
  "message": "Profile updated successfully.",
  "user": {
    "id": 1,
    "name": "New Name",
    "email": "ali@example.com",
    "role": "STUDENT",
    "is_active": true
  }
}
```

---

## 2) Students

Base path: `/api/v1/students/`

### 2.1 Student Profiles (Router)
Router prefix: `profiles`

- **GET** `/api/v1/students/profiles/`
  - Supports filters: `program`, `admission_year`, `district`
  - Search: `roll_no`, `user.name`, `user.email`
  - Ordering: `roll_no`, `admission_year`, `created_at`

- **GET** `/api/v1/students/profiles/{id}/`
- **POST** `/api/v1/students/profiles/`
- **PUT** `/api/v1/students/profiles/{id}/`
- **PATCH** `/api/v1/students/profiles/{id}/`
- **DELETE** `/api/v1/students/profiles/{id}/`

Extra action:
- **GET** `/api/v1/students/profiles/me/`
  - Returns current logged-in student's profile.

Permissions summary:
- Read list/retrieve: Admin/Teacher can see all; Students can see only their own.
- Create/Destroy: Admin only.

### 2.2 Results (Router)
Router prefix: `results`

CRUD endpoints at:
- `/api/v1/students/results/`
- `/api/v1/students/results/{id}/`

Filters:
- `course`, `grade`

Search:
- `student.roll_no`, `student.user.name`, `course.code`

Permissions:
- Admin/Teacher: all results
- Student: only own results

### 2.3 Attendance (Router)
Router prefix: `attendance`

- `/api/v1/students/attendance/`
- `/api/v1/students/attendance/{id}/`

Filters:
- `course`, `status`, `date`

Permissions:
- Admin/Teacher: all
- Student: only own

### 2.4 Fee Records (Router)
Router prefix: `fees`

- `/api/v1/students/fees/`
- `/api/v1/students/fees/{id}/`

Filters:
- `status`, `due_date`

Search:
- `student.roll_no`

Permissions:
- Admin/Teacher: all
- Student: own

---

## 3) Teachers

Base path: `/api/v1/teachers/`

### 3.1 Teacher Profiles (Router)
Router prefix: `profiles`

- **GET** `/api/v1/teachers/profiles/`
- **GET** `/api/v1/teachers/profiles/{id}/`
- **POST** `/api/v1/teachers/profiles/` (Admin only)
- **PUT/PATCH/DELETE** `/api/v1/teachers/profiles/{id}/` (Admin only / limited by role)

Extra action:
- **GET** `/api/v1/teachers/profiles/me/`

Permissions:
- Students can view teachers list.
- Create/Delete: Admin only.

### 3.2 Courses (Router)
Router prefix: `courses`

CRUD at:
- `/api/v1/teachers/courses/`
- `/api/v1/teachers/courses/{id}/`

Filters:
- `department`, `semester`

Search:
- `name`, `code`

### 3.3 Assignments (Router)
Router prefix: `assignments`

CRUD at:
- `/api/v1/teachers/assignments/`
- `/api/v1/teachers/assignments/{id}/`

Filters:
- `course`, `teacher`

Permissions:
- Create/Update/Destroy: Admin or Teacher

### 3.4 Timetable (Router)
Router prefix: `timetable`

CRUD at:
- `/api/v1/teachers/timetable/`
- `/api/v1/teachers/timetable/{id}/`

Filters:
- `day`, `course`, `teacher`

---

## 4) Departments

Base path: `/api/v1/departments/`

Router registers at `''` with `DepartmentViewSet`.

Endpoints:
- **GET** `/api/v1/departments/`
- **GET** `/api/v1/departments/{id}/`
- **POST** `/api/v1/departments/` (Admin)
- **PUT/PATCH/DELETE** `/api/v1/departments/{id}/` (Admin)

Permissions:
- Public read (list/retrieve)
- Write restricted to Admin

Filters:
- `hod`

Search:
- `name`, `description`

Ordering:
- `name`, `created_at`, `total_seats`

---

## 5) Admissions

Base path: `/api/v1/admissions/`

Router registers at `''`.

Endpoints:
- **GET** `/api/v1/admissions/`
- **GET** `/api/v1/admissions/{id}/`
- **POST** `/api/v1/admissions/`
- **PUT/PATCH/DELETE** `/api/v1/admissions/{id}/`

Permissions:
- Students: only their own applications
- Admin/Teacher: can edit status/application data

Filters:
- `status`, `department`

Search:
- `student.roll_no`, `student.user.name`

---

## 6) Notices

Base path: `/api/v1/notices/`

Router registers at `''`.

Endpoints:
- **GET** `/api/v1/notices/`
- **GET** `/api/v1/notices/{id}/`
- **POST** `/api/v1/notices/` (Admin/Teacher)
- **PUT/PATCH/DELETE** `/api/v1/notices/{id}/` (Admin/Teacher)

Read permissions logic:
- If unauthenticated: only `target_role='ALL'`
- Admin: all notices
- Teacher: `ALL` and `TEACHER`
- Student: `ALL` and `STUDENT`

Filters:
- `target_role`, `posted_by`

Search:
- `title`, `content`

---

## 7) News & Events

Base path: `/api/v1/news_events/`

Router registers at `''`.

Endpoints:
- **GET** `/api/v1/news_events/`
- **GET** `/api/v1/news_events/{id}/`
- **POST** `/api/v1/news_events/` (Admin)
- **PUT/PATCH/DELETE** `/api/v1/news_events/{id}/` (Admin)

Filters:
- `event_date`

Search:
- `title`, `body`

---

## 8) Gallery

Base path: `/api/v1/gallery/`

Router registers at `''`.

Endpoints:
- **GET** `/api/v1/gallery/`
- **GET** `/api/v1/gallery/{id}/`
- **POST** `/api/v1/gallery/` (Admin/Teacher)
- **PUT/PATCH/DELETE** `/api/v1/gallery/{id}/` (Admin/Teacher)

Read permissions:
- Anyone can read

Filters:
- `category`, `uploaded_by`

Search:
- `caption`

---

## 9) Chatbot

Base path: `/api/v1/chatbot/`

### 9.1 Send message
- **POST** `/api/v1/chatbot/message/`

Request body:
```json
{
  "session_id": "abc123",
  "user_message": "What is the admission process?",
  "language": "English"
}
```

Response (200):
```json
{
  "response": "<assistant response>",
  "session_id": "abc123",
  "timestamp": "2026-06-13T10:11:12Z"
}
```

### 9.2 Chatbot Logs (Router)
Router prefix: `logs`

Endpoints:
- **GET** `/api/v1/chatbot/logs/`
- **GET** `/api/v1/chatbot/logs/{id}/`
- **POST** `/api/v1/chatbot/logs/`
- **PUT/PATCH/DELETE** `/api/v1/chatbot/logs/{id}/`

Permission:
- Create: AllowAny
- Read: Admin all, authenticated users see their own; can filter by `session_id` via query param.

Filters:
- `session_id`, `user`

Search:
- `message`, `response`

---

## 10) Analytics (Admin/Teacher only)

Base path: `/api/v1/analytics/`

### 10.1 Summary
- **GET** `/api/v1/analytics/summary/`

Response (200):
```json
{
  "total_students": 123,
  "total_teachers": 10,
  "total_departments": 6,
  "total_admissions": 42
}
```

### 10.2 Department Stats
- **GET** `/api/v1/analytics/departments/`

Response (200):
```json
[
  {
    "department_name": "Computer Science",
    "student_count": 80,
    "teacher_count": 3,
    "total_seats": 50
  }
]
```

### 10.3 Admission Stats
- **GET** `/api/v1/analytics/admissions/`

Response (200):
```json
{
  "pending_count": 10,
  "approved_count": 25,
  "rejected_count": 7,
  "total_applications": 42
}
```

---

## 11) AI Engine (Predict)

Base path: `/api/v1/ai/`

### 11.1 Predict Admission Eligibility
- **POST** `/api/v1/ai/predict/`

Permission:
- Authenticated users only.

Request body (two modes):
1) Provide `student` id:
```json
{ "student": 15 }
```

2) Provide raw fields:
```json
{
  "matric_marks": 980,
  "inter_marks": 890,
  "age": 18,
  "district": "Jhang",
  "subjects_combo": "Pre-Engineering/ICS",
  "career_interest": "Software Engineer"
}
```

Response (201):
```json
{
  "id": 99,
  "student": 15,
  "prediction_type": "ELIGIBILITY",
  "input_json": { /* request fields */ },
  "output_json": {
    "advice": "<eligibility advice>",
    "probability": 0.85
  },
  "created_at": "2026-06-13T10:11:12Z"
}
```

