# GCJ Official Website Database (MySQL) - ERD & Relationships

This document is derived from `gcj_website/database/schema.sql`.

## Main Entity Relationships (ERD overview)

High-level graph (arrows show FK ownership):

- `roles (1) -> (N) users`
- `users (1) -> (N) teachers` (via `teachers.user_id`)
- `departments (1) -> (N) teachers` (via `teachers.department_id`)
- `teachers (1) -> (N) departments` (via `departments.hod_id`)
- `users (1) -> (N) students` (via `students.user_id`)

- `students (1) -> (N) enrollments`
- `courses (1) -> (N) enrollments`

- `courses (1) -> (N) timetable`
- `teachers (1) -> (N) timetable`

- `students (1) -> (N) admissions`
- `departments (1) -> (N) admissions`

- `students (1) -> (N) results`
- `courses (1) -> (N) results`

- `students (1) -> (N) attendance`
- `courses (1) -> (N) attendance`

- `users (1) -> (N) notices` (via `notices.posted_by`)

- `students (1) -> (N) ai_predictions`

- `users (1) -> (N) chatbot_logs` (via `chatbot_logs.user_id`, nullable)
- `users (1) -> (N) gallery` (via `gallery.uploaded_by`)

- `students (1) -> (N) fee_records`

- `teachers (1) -> (N) assignments`
- `courses (1) -> (N) assignments`

## Tables & Key Columns

### `roles`
- `id` (PK)
- `role_name` (unique)
- `permissions_json`

### `users`
- `id` (PK)
- `name`, `email` (unique)
- `password_hash`
- `role_id` (FK -> `roles.id`)
- `is_active`

### `departments`
- `id` (PK)
- `name` (unique)
- `description`
- `hod_id` (FK -> `teachers.id`, ON DELETE SET NULL)
- `total_seats`
- `image_url`

### `teachers`
- `id` (PK)
- `user_id` (FK -> `users.id`, ON DELETE CASCADE)
- `designation`
- `department_id` (FK -> `departments.id`, ON DELETE RESTRICT)
- `qualification`
- `joining_date`

### `students`
- `id` (PK)
- `user_id` (FK -> `users.id`, ON DELETE CASCADE)
- `roll_no` (unique)
- `matric_marks`, `inter_marks`
- `district`, `program`
- `admission_year`

### `courses`
- `id` (PK)
- `name`, `code` (unique)
- `department_id` (FK -> `departments.id`, ON DELETE CASCADE)
- `credit_hours`, `semester`

### `enrollments`
- `id` (PK)
- `student_id` (FK -> `students.id`)
- `course_id` (FK -> `courses.id`)
- `semester`
- `status` enum

### `timetable`
- `id` (PK)
- `course_id` (FK -> `courses.id`)
- `teacher_id` (FK -> `teachers.id`)
- `day`, `start_time`, `end_time`, `room`

### `admissions`
- `id` (PK)
- `student_id` (FK -> `students.id`)
- `department_id` (FK -> `departments.id`)
- `status` enum
- `applied_date`
- `merit_score`
- `ai_recommendation`

### `results`
- `id` (PK)
- `student_id` (FK -> `students.id`)
- `course_id` (FK -> `courses.id`)
- `marks_obtained`, `total_marks`, `grade`

### `attendance`
- `id` (PK)
- `student_id` (FK -> `students.id`)
- `course_id` (FK -> `courses.id`)
- `date`
- `status` enum

### `notices`
- `id` (PK)
- `title`, `content`
- `posted_by` (FK -> `users.id`, ON DELETE CASCADE)
- `target_role` (e.g., ALL / STUDENT / TEACHER)

### `news_events`
- `id` (PK)
- `title`, `body`
- `event_date`
- `image_url`

### `ai_predictions`
- `id` (PK)
- `student_id` (FK -> `students.id`)
- `input_json`, `output_json`
- `model_used`

### `chatbot_logs`
- `id` (PK)
- `user_id` (FK -> `users.id`, ON DELETE SET NULL)
- `session_id`
- `message`, `response`

### `gallery`
- `id` (PK)
- `image_url`, `caption`, `category`
- `uploaded_by` (FK -> `users.id`)

### `fee_records`
- `id` (PK)
- `student_id` (FK -> `students.id`)
- `amount`, `due_date`, `paid_date`
- `status` enum

### `assignments`
- `id` (PK)
- `teacher_id` (FK -> `teachers.id`)
- `course_id` (FK -> `courses.id`)
- `title`, `description`, `due_date`, `file_url`

## Indexing / Performance Notes

`database/schema.sql` defines several performance indexes:
- `users(email)`
- `roles(role_name)`
- `students(roll_no)`
- `courses(code)`
- `enrollments(semester, status)`
- `timetable(room, day)`
- `results(student_id, course_id)`
- `attendance(date, student_id)`
- `notices(target_role)`
- `fee_records(due_date, status)`
- `assignments(due_date)`
- `chatbot_logs(session_id)`

These support high-traffic list/filter queries.

