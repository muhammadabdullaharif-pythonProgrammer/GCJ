import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Menu,
  Home,
  User,
  BookOpen,
  FileText,
  CalendarDays,
  Bell,
  Sparkles,
  Receipt,
  LayoutDashboard,
  Upload,
  ClipboardCheck,
  CalendarClock,
  ClipboardList,
  Users,
  ShieldCheck,
  Building2,
  GraduationCap,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

const brand = {
  name: 'Govt. College Jhang',
  tagline: 'Portal • Est. 1926',
};

function getRoleFromStorage() {
  const raw = localStorage.getItem('gcj_session');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.role || null;
  } catch {
    return null;
  }
}

function menuForRole(role) {
  if (role === 'student') {
    return [
      { label: 'Dashboard', path: '/portal/student', icon: <Home className="w-4 h-4" /> },
      { label: 'Profile', path: '/portal/student/profile', icon: <User className="w-4 h-4" /> },
      { label: 'Courses', path: '/portal/student/courses', icon: <BookOpen className="w-4 h-4" /> },
      { label: 'Results', path: '/portal/student/results', icon: <FileText className="w-4 h-4" /> },
      { label: 'Attendance', path: '/portal/student/attendance', icon: <CalendarDays className="w-4 h-4" /> },
      { label: 'Notices', path: '/portal/student/notices', icon: <Bell className="w-4 h-4" /> },
      { label: 'AI Advisor', path: '/portal/student/advisor', icon: <Sparkles className="w-4 h-4" /> },
      { label: 'Fee Status', path: '/portal/student/fees', icon: <Receipt className="w-4 h-4" /> },
    ];
  }

  if (role === 'teacher') {
    return [
      { label: 'Dashboard', path: '/portal/teacher', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Assignments', path: '/portal/teacher/assignments', icon: <Upload className="w-4 h-4" /> },
      { label: 'Marks', path: '/portal/teacher/marks', icon: <ClipboardCheck className="w-4 h-4" /> },
      { label: 'Timetable', path: '/portal/teacher/timetable', icon: <CalendarClock className="w-4 h-4" /> },
      { label: 'Notices', path: '/portal/teacher/notices', icon: <Bell className="w-4 h-4" /> },
    ];
  }

  if (role === 'admin') {
    return [
      { label: 'Dashboard', path: '/portal/admin', icon: <BarChart3 className="w-4 h-4" /> },
      { label: 'Students', path: '/portal/admin/students', icon: <Users className="w-4 h-4" /> },
      { label: 'Teachers', path: '/portal/admin/teachers', icon: <GraduationCap className="w-4 h-4" /> },
      { label: 'Departments', path: '/portal/admin/departments', icon: <Building2 className="w-4 h-4" /> },
      { label: 'Admissions', path: '/portal/admin/admissions', icon: <FileText className="w-4 h-4" /> },
      { label: 'Notices', path: '/portal/admin/notices', icon: <Bell className="w-4 h-4" /> },
      { label: 'Gallery', path: '/portal/admin/gallery', icon: <ImageIcon className="w-4 h-4" /> },
      { label: 'Chatbot Logs', path: '/portal/admin/chatbot-logs', icon: <MessageSquare className="w-4 h-4" /> },
      { label: 'Analytics', path: '/portal/admin/analytics', icon: <ShieldCheck className="w-4 h-4" /> },
    ];
  }

  return [];
}

export default function Sidebar({ role: roleProp, open, onToggle }) {
  const location = useLocation();
  const [role, setRole] = useState(roleProp || getRoleFromStorage());

  useEffect(() => {
    if (roleProp) setRole(roleProp);
  }, [roleProp]);

  const items = useMemo(() => menuForRole(role), [role]);

  const isOpen = open ?? true;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 78 }}
      className="relative h-[calc(100vh-0px)]"
    >
      <div className="glass border border-theme-border/60 rounded-3xl h-full overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-theme-border/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-theme-primary to-brand-gold flex items-center justify-center shadow-lg shadow-theme-primary/20 flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="min-w-0"
                >
                  <div className="text-theme-text font-extrabold text-sm truncate">{brand.name}</div>
                  <div className="text-[10px] text-brand-gold font-extrabold uppercase tracking-widest truncate">{brand.tagline}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="p-2 rounded-xl bg-theme-primary-light/10 border border-theme-border/60 text-theme-text hover:bg-theme-primary-light/20 cursor-pointer"
              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}
        </div>

        <nav className="p-3 space-y-2">
          {items.map((it) => (
            <NavLink
              key={it.path}
              to={it.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? 'bg-theme-primary text-white border-theme-primary/30 shadow-md shadow-theme-primary/10'
                    : 'bg-theme-primary-light/10 border-theme-border/60 hover:bg-theme-primary-light/20 text-theme-text'
                }`
              }
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-xl">{it.icon}</div>
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    className={`text-xs font-extrabold uppercase tracking-wider ${location.pathname === it.path ? 'text-white' : 'text-theme-text'}`}
                  >
                    {it.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}

          {items.length === 0 && (
            <div className="mt-6 text-theme-muted text-xs font-extrabold uppercase tracking-wider text-center">
              No menu for this role
            </div>
          )}
        </nav>
      </div>
    </motion.aside>
  );
}

