import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Import Shared Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Departments from './pages/Departments';
import DepartmentDetail from './pages/DepartmentDetail';
import Admissions from './pages/Admissions';
import Faculty from './pages/Faculty';
import NewsEvents from './pages/NewsEvents';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

// Portal Auth
import Login from './pages/Login';
import Register from './pages/Register';

// Portal Shared
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Portal Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentCourses from './pages/student/Courses';
import StudentResults from './pages/student/Results';
import StudentAttendance from './pages/student/Attendance';
import StudentNotices from './pages/student/Notices';
import StudentAIAdvisor from './pages/student/AIAdvisor';
import StudentFees from './pages/student/FeeStatus';

import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherMarks from './pages/teacher/Marks';
import TeacherTimetable from './pages/teacher/Timetable';
import TeacherNotices from './pages/teacher/Notices';

import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminTeachers from './pages/admin/Teachers';
import AdminDepartments from './pages/admin/Departments';
import AdminAdmissions from './pages/admin/Admissions';
import AdminNotices from './pages/admin/Notices';
import AdminGallery from './pages/admin/Gallery';
import AdminChatbotLogs from './pages/admin/ChatbotLogs';
import AdminAnalytics from './pages/admin/Analytics';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Inner routes wrapper to support useLocation for AnimatePresence
function AnimatedRoutes({ darkMode, setDarkMode }) {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-theme-bg text-theme-text transition-colors duration-300">
      
      {/* Sticky Navigation bar */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main page content area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Marketing / Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/departments/:id" element={<DepartmentDetail />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/news" element={<NewsEvents />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />

            {/* Portal Auth */}
            <Route path="/portal/login" element={<Login />} />
            <Route path="/portal/register" element={<Register />} />

            {/* Student */}
            <Route path="/portal/student/*" element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route
                path=""
                element={
                  <DashboardLayout role="student">
                    <StudentDashboard />
                  </DashboardLayout>
                }
              />
              <Route
                path="profile"
                element={
                  <DashboardLayout role="student">
                    <StudentProfile />
                  </DashboardLayout>
                }
              />
              <Route
                path="courses"
                element={
                  <DashboardLayout role="student">
                    <StudentCourses />
                  </DashboardLayout>
                }
              />
              <Route
                path="results"
                element={
                  <DashboardLayout role="student">
                    <StudentResults />
                  </DashboardLayout>
                }
              />
              <Route
                path="attendance"
                element={
                  <DashboardLayout role="student">
                    <StudentAttendance />
                  </DashboardLayout>
                }
              />
              <Route
                path="notices"
                element={
                  <DashboardLayout role="student">
                    <StudentNotices />
                  </DashboardLayout>
                }
              />
              <Route
                path="advisor"
                element={
                  <DashboardLayout role="student">
                    <StudentAIAdvisor />
                  </DashboardLayout>
                }
              />
              <Route
                path="fees"
                element={
                  <DashboardLayout role="student">
                    <StudentFees />
                  </DashboardLayout>
                }
              />
            </Route>

            {/* Teacher */}
            <Route path="/portal/teacher/*" element={<ProtectedRoute allowedRoles={["teacher"]} />}>
              <Route
                path=""
                element={
                  <DashboardLayout role="teacher">
                    <TeacherDashboard />
                  </DashboardLayout>
                }
              />
              <Route
                path="assignments"
                element={
                  <DashboardLayout role="teacher">
                    <TeacherAssignments />
                  </DashboardLayout>
                }
              />
              <Route
                path="marks"
                element={
                  <DashboardLayout role="teacher">
                    <TeacherMarks />
                  </DashboardLayout>
                }
              />
              <Route
                path="timetable"
                element={
                  <DashboardLayout role="teacher">
                    <TeacherTimetable />
                  </DashboardLayout>
                }
              />
              <Route
                path="notices"
                element={
                  <DashboardLayout role="teacher">
                    <TeacherNotices />
                  </DashboardLayout>
                }
              />
            </Route>

            {/* Admin */}
            <Route path="/portal/admin/*" element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route
                path=""
                element={
                  <DashboardLayout role="admin">
                    <AdminDashboard />
                  </DashboardLayout>
                }
              />
              <Route
                path="students"
                element={
                  <DashboardLayout role="admin">
                    <AdminStudents />
                  </DashboardLayout>
                }
              />
              <Route
                path="teachers"
                element={
                  <DashboardLayout role="admin">
                    <AdminTeachers />
                  </DashboardLayout>
                }
              />
              <Route
                path="departments"
                element={
                  <DashboardLayout role="admin">
                    <AdminDepartments />
                  </DashboardLayout>
                }
              />
              <Route
                path="admissions"
                element={
                  <DashboardLayout role="admin">
                    <AdminAdmissions />
                  </DashboardLayout>
                }
              />
              <Route
                path="notices"
                element={
                  <DashboardLayout role="admin">
                    <AdminNotices />
                  </DashboardLayout>
                }
              />
              <Route
                path="gallery"
                element={
                  <DashboardLayout role="admin">
                    <AdminGallery />
                  </DashboardLayout>
                }
              />
              <Route
                path="chatbot-logs"
                element={
                  <DashboardLayout role="admin">
                    <AdminChatbotLogs />
                  </DashboardLayout>
                }
              />
              <Route
                path="analytics"
                element={
                  <DashboardLayout role="admin">
                    <AdminAnalytics />
                  </DashboardLayout>
                }
              />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>

      {/* Shared Footer */}
      <Footer />

      {/* Floating Chatbot Advisor */}
      <ChatbotWidget />
    </div>
  );
}

export default function App() {
  // Initialize dark mode from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode classes to document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes darkMode={darkMode} setDarkMode={setDarkMode} />
    </BrowserRouter>
  );
}
