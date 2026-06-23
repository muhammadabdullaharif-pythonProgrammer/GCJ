-- SQL Seed Data for Government College Jhang (GCJ)
-- Populate all 18 tables for testing/development

USE gcj_db;

-- Temporarily disable foreign key checks to make seeding order straightforward
SET FOREIGN_KEY_CHECKS = 0;

-- Clear any existing records to prevent unique key constraint issues
TRUNCATE TABLE roles;
TRUNCATE TABLE users;
TRUNCATE TABLE departments;
TRUNCATE TABLE teachers;
TRUNCATE TABLE students;
TRUNCATE TABLE courses;
TRUNCATE TABLE enrollments;
TRUNCATE TABLE timetable;
TRUNCATE TABLE admissions;
TRUNCATE TABLE results;
TRUNCATE TABLE attendance;
TRUNCATE TABLE notices;
TRUNCATE TABLE news_events;
TRUNCATE TABLE ai_predictions;
TRUNCATE TABLE chatbot_logs;
TRUNCATE TABLE gallery;
TRUNCATE TABLE fee_records;
TRUNCATE TABLE assignments;

-- 1. Seeding Roles
INSERT INTO roles (id, role_name, permissions_json) VALUES
(1, 'Administrator', '{"portal": ["create", "read", "update", "delete"], "admissions": ["manage"], "users": ["manage"]}'),
(2, 'Faculty Member', '{"portal": ["read"], "attendance": ["mark"], "results": ["upload"], "assignments": ["manage"]}'),
(3, 'Student', '{"portal": ["read"], "results": ["view"], "attendance": ["view"], "assignments": ["submit"]}'),
(4, 'Guest User', '{"portal": ["read"], "admissions": ["apply"]}');

-- 2. Seeding Users (Passwords are pbkdf2_sha256 pbkdf2 mock values)
INSERT INTO users (id, name, email, password_hash, role_id, is_active) VALUES
(1, 'Dr. Sajid Mahmood', 'sajid.mahmood@gcj.edu.pk', 'pbkdf2_sha256$260000$mockedpasswordhash123', 2, TRUE),
(2, 'Prof. Muhammad Akram', 'm.akram@gcj.edu.pk', 'pbkdf2_sha256$260000$mockedpasswordhash123', 2, TRUE),
(3, 'Prof. Tariq Javed', 'tariq.javed@gcj.edu.pk', 'pbkdf2_sha256$260000$mockedpasswordhash123', 2, TRUE),
(4, 'Muhammad Abdullah', 'student.abdullah@gmail.com', 'pbkdf2_sha256$260000$studentpasswordhash99', 3, TRUE),
(5, 'Zainab Bibi', 'student.zainab@gmail.com', 'pbkdf2_sha256$260000$studentpasswordhash99', 3, TRUE),
(6, 'Super Admin', 'admin@gcj.edu.pk', 'pbkdf2_sha256$260000$adminpasswordhash101', 1, TRUE),
(7, 'Guest Applicant', 'applicant.guest@yahoo.com', 'pbkdf2_sha256$260000$guestpasswordhash', 4, TRUE);

-- 3. Seeding Departments (Note: hod_id FK set to NULL temporarily, updated after seeding teachers)
INSERT INTO departments (id, name, description, hod_id, total_seats, image_url) VALUES
(1, 'Computer Science & Information Technology', 'State-of-the-art computer labs and advanced programming curriculum.', NULL, 60, '/static/images/depts/csit.jpg'),
(2, 'Chemistry', 'Equipped with organic, biochemistry and analytical laboratory setups.', NULL, 50, '/static/images/depts/chem.jpg'),
(3, 'English Literature', 'Engaging syntax, reading rooms and creative communications modules.', NULL, 40, '/static/images/depts/english.jpg');

-- 4. Seeding Teachers
INSERT INTO teachers (id, user_id, designation, department_id, qualification, joining_date) VALUES
(1, 1, 'Head of Department / Associate Professor', 1, 'Ph.D in Computer Science (PU)', '2015-08-12'),
(2, 2, 'Professor', 2, 'Ph.D in Organic Chemistry (QAU)', '2010-09-01'),
(3, 3, 'Assistant Professor', 3, 'M.Phil in English Literature (UAF)', '2018-02-15');

-- Now update HOD field in departments with proper teacher IDs
UPDATE departments SET hod_id = 1 WHERE id = 1;
UPDATE departments SET hod_id = 2 WHERE id = 2;
UPDATE departments SET hod_id = 3 WHERE id = 3;

-- 5. Seeding Students
INSERT INTO students (id, user_id, roll_no, matric_marks, inter_marks, district, program, admission_year) VALUES
(1, 4, 'GCJ-2026-CS-01', 1012, 945, 'Jhang', 'BS Computer Science', 2026),
(2, 5, 'GCJ-2026-CH-03', 980, 890, 'Chiniot', 'BS Chemistry', 2026);

-- 6. Seeding Courses
INSERT INTO courses (id, name, code, department_id, credit_hours, semester) VALUES
(1, 'Introduction to Programming', 'CS-101', 1, 4, 1),
(2, 'Object-Oriented Programming', 'CS-201', 1, 4, 2),
(3, 'Organic Chemistry-I', 'CH-102', 2, 3, 1),
(4, 'History of English Literature', 'EN-101', 3, 3, 1);

-- 7. Seeding Enrollments
INSERT INTO enrollments (id, student_id, course_id, semester, status) VALUES
(1, 1, 1, 1, 'Enrolled'),
(2, 1, 4, 1, 'Enrolled'),
(3, 2, 3, 1, 'Enrolled');

-- 8. Seeding Timetables
INSERT INTO timetable (id, course_id, teacher_id, day, start_time, end_time, room) VALUES
(1, 1, 1, 'Monday', '09:00:00', '10:30:00', 'IT-Lab 1'),
(2, 1, 1, 'Wednesday', '09:00:00', '10:30:00', 'IT-Lab 1'),
(3, 3, 2, 'Tuesday', '11:00:00', '12:30:00', 'Chemistry Lab 2'),
(4, 4, 3, 'Thursday', '10:00:00', '11:30:00', 'Room 14');

-- 9. Seeding Admissions
INSERT INTO admissions (id, student_id, department_id, status, applied_date, merit_score, ai_recommendation) VALUES
(1, 1, 1, 'Admitted', '2026-06-02', 91.50, 'Highly recommended. Strong academic background in Matric and Intermediate Mathematics.'),
(2, 2, 2, 'Admitted', '2026-06-03', 85.20, 'Recommended. Adequate science scores meet intermediate enrollment requirements.');

-- 10. Seeding Results
INSERT INTO results (id, student_id, course_id, marks_obtained, total_marks, grade) VALUES
(1, 1, 1, 88.00, 100.00, 'A'),
(2, 2, 3, 76.50, 100.00, 'B');

-- 11. Seeding Attendance
INSERT INTO attendance (id, student_id, course_id, date, status) VALUES
(1, 1, 1, '2026-06-10', 'Present'),
(2, 1, 1, '2026-06-11', 'Present'),
(3, 2, 3, '2026-06-11', 'Absent');

-- 12. Seeding Notices
INSERT INTO notices (id, title, content, posted_by, target_role) VALUES
(1, 'Midterm Exam Schedule', 'Midterm examinations for all BS semesters will start from July 10, 2026.', 6, 'All'),
(2, 'Faculty Meeting Notice', 'A departmental review session is scheduled for tomorrow at 2:00 PM in the HOD room.', 1, 'Faculty Member');

-- 13. Seeding News Events
INSERT INTO news_events (id, title, body, event_date, image_url) VALUES
(1, 'GCJ Centenary Celebration', 'Government College Jhang celebrates 100 years of academic distinction next week on campus.', '2026-06-20 10:00:00', '/static/images/events/centenary.jpg'),
(2, 'Annual Science Fair 2026', 'Students are invited to display physics and chemistry research prototypes at the annual expo.', '2026-06-28 09:00:00', '/static/images/events/science_fair.jpg');

-- 14. Seeding AI Predictions
INSERT INTO ai_predictions (id, student_id, input_json, output_json, model_used) VALUES
(1, 1, '{"matric_marks": 1012, "inter_marks": 945, "attendance_rate": 0.95}', '{"graduation_probability": 0.98, "risk_level": "Low", "suggested_electives": ["Machine Learning", "Cloud Computing"]}', 'GCJ-GradPredict-v1'),
(2, 2, '{"matric_marks": 980, "inter_marks": 890, "attendance_rate": 0.70}', '{"graduation_probability": 0.81, "risk_level": "Medium", "suggested_electives": ["Organic Synthesis"]}', 'GCJ-GradPredict-v1');

-- 15. Seeding Chatbot Logs
INSERT INTO chatbot_logs (id, user_id, session_id, message, response) VALUES
(1, 4, 'sess_ab123xyz', 'What are the credit hours for Intro to Programming?', 'The Introduction to Programming (CS-101) course has 4 credit hours (3 hours lecture + 1 hour practical).'),
(2, NULL, 'sess_guest888', 'Tell me about intermediate admissions.', 'Admissions for intermediate classes (F.Sc, ICS, I.Com) start in July after Matriculation results. You can submit your online application through the Admissions page.');

-- 16. Seeding Gallery
INSERT INTO gallery (id, image_url, caption, category, uploaded_by) VALUES
(1, '/static/gallery/campus_front.jpg', 'Main Academic Building Facade', 'Campus', 6),
(2, '/static/gallery/sports_cricket.jpg', 'GCJ Cricket Team Practice Session', 'Sports', 1);

-- 17. Seeding Fee Records
INSERT INTO fee_records (id, student_id, amount, due_date, paid_date, status) VALUES
(1, 1, 35000.00, '2026-06-30', '2026-06-05', 'Paid'),
(2, 2, 28000.00, '2026-06-30', NULL, 'Unpaid');

-- 18. Seeding Assignments
INSERT INTO assignments (id, teacher_id, course_id, title, description, due_date, file_url) VALUES
(1, 1, 1, 'Programming Assignment 1: Syntax & Loops', 'Write standard Python programs using loops and conditional logic.', '2026-06-18 23:59:00', '/media/assignments/assignment1.pdf'),
(2, 2, 3, 'Lab Homework: Molecular Structure Drawing', 'Draw structural drawings for basic aromatic hydrocarbons.', '2026-06-21 17:00:00', '/media/assignments/lab_homework2.pdf');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
