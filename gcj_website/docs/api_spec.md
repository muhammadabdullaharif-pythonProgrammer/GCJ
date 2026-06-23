# GCJ Official Website API Specification

All API routes are prefixed by `/api/v1/` (or `/api/` depending on root router settings).

---

## 🔐 1. Authentication Routes

### Login (Obtain JWT Token)
- **URL**: `/api/v1/auth/login/`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "student123",
    "password": "securepassword"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "student123",
      "email": "student@gcj.edu.pk",
      "role": "student"
    }
  }
  ```

### Refresh Token
- **URL**: `/api/v1/auth/token/refresh/`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

## 🏛️ 2. Portal & Academics

### Get Departments
- **URL**: `/api/v1/portal/departments/`
- **Method**: `GET`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "name": "Computer Science & Information Technology",
      "code": "CSIT",
      "description": "...",
      "head_of_department": "Dr. Sajid Mahmood"
    }
  ]
  ```

### Get Courses
- **URL**: `/api/v1/portal/courses/`
- **Method**: `GET`
- **Parameters**: `department_id` (optional), `degree_type` (optional)
- **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "department": {
        "id": 1,
        "name": "Computer Science & Information Technology"
      },
      "title": "BS Computer Science",
      "code": "BS-CS-4",
      "degree_type": "Undergraduate",
      "duration_years": 4.0,
      "eligibility_criteria": "...",
      "fee_per_semester": 35000,
      "syllabus_summary": "..."
    }
  ]
  ```

---

## 🎓 3. Admissions

### Submit Admission Application
- **URL**: `/api/v1/portal/admissions/`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "student_name": "Muhammad Ali",
    "student_email": "ali@example.com",
    "student_phone": "+923001234567",
    "applied_course_id": 1,
    "matric_marks": 980,
    "intermediate_marks": 890
  }
  ```
- **Response (210 Created)**:
  ```json
  {
    "id": 15,
    "student_name": "Muhammad Ali",
    "status": "Pending",
    "application_date": "2026-06-12T13:40:00Z"
  }
  ```

---

## 🤖 4. AI Advisor Assistant

### Query AI Advisor
- **URL**: `/api/v1/advisor/query/`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "query": "What are the eligibility criteria for BS CS?"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "query": "What are the eligibility criteria for BS CS?",
    "response": "To apply for the BS Computer Science (BS CS) program at Government College Jhang, you must have completed Intermediate (Pre-Engineering / ICS) with Mathematics, scoring at least 50% marks in aggregate. Let me know if you would like info on how to submit your application!"
  }
  ```

---

## 📢 5. Announcements & Notifications

### Get Latest Announcements
- **URL**: `/api/v1/portal/announcements/`
- **Method**: `GET`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "title": "BS Admissions 2026 Open",
      "content": "...",
      "category": "Admission",
      "publish_date": "2026-06-01T09:00:00Z"
    }
  ]
  ```
