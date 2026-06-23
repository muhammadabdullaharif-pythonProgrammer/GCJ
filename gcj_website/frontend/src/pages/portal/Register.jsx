import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, IdCard, Building2, GraduationCap, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../utils/api';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roll_no: '',
    departmentId: '',
    courseId: '',
    password: '',
  });

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [feedback, setFeedback] = useState(null);

  const canSubmit = useMemo(() => {
    return (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.roll_no &&
      formData.departmentId &&
      formData.password &&
      String(formData.password).length >= 4
    );
  }, [formData]);

  React.useEffect(() => {
    async function load() {
      try {
        const depts = await api.getDepartments();
        setDepartments(depts);
        if (depts?.length) {
          // Preload courses to keep UI responsive
          const allCourses = await api.getCourses();
          setCourses(allCourses.filter((c) => c.department === parseInt(depts[0].id)));
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  React.useEffect(() => {
    async function loadCourses() {
      if (!formData.departmentId) {
        setCourses([]);
        setFormData((p) => ({ ...p, courseId: '' }));
        return;
      }
      try {
        const allCourses = await api.getCourses();
        setCourses(allCourses.filter((c) => c.department === parseInt(formData.departmentId)));
      } catch {
        setCourses([]);
      }
    }
    loadCourses();
  }, [formData.departmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!canSubmit) {
      setFeedback({
        type: 'error',
        message: 'Please fill all required fields (and password length ≥ 4).',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Use admissions endpoint as a placeholder for registration.
      // Backend auth/register is not specified; we implement a demo student registration.
      await new Promise((r) => setTimeout(r, 700));

      // Optional: submit admission-like request if endpoint expects it.
      // We'll avoid strict coupling by submitting minimal payload.
      await api.submitAdmission({
        student_name: formData.name,
        student_email: formData.email,
        student_phone: formData.phone,
        student_roll_no: formData.roll_no,
        department: parseInt(formData.departmentId),
        applied_course_id: formData.courseId ? parseInt(formData.courseId) : null,
        merit_score: 85.5,
      });

      const token = btoa(JSON.stringify({ t: Date.now(), roll: formData.roll_no, role: 'student' })).slice(0, 24);
      localStorage.setItem('gcj_token', token);
      localStorage.setItem('gcj_role', 'student');
      localStorage.setItem(
        'gcj_user',
        JSON.stringify({
          id: formData.roll_no,
          name: formData.name,
          email: formData.email,
        })
      );

      setIsSubmitting(false);
      setFeedback({ type: 'success', message: 'Registration successful. Redirecting to your student dashboard...' });
      setTimeout(() => navigate('/portal/student/dashboard', { replace: true }), 900);
    } catch (err) {
      setIsSubmitting(false);
      setFeedback({ type: 'error', message: 'Registration failed. Please try again.' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8 pb-16"
    >
      <section className="relative rounded-3xl overflow-hidden glass border border-theme-border/60 p-6 sm:p-10 text-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-theme-primary/10 to-brand-gold/5 pointer-events-none" />
        <div className="relative space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-theme-primary to-brand-gold flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xs uppercase tracking-widest text-brand-gold font-extrabold">GCJ Portal</div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">Student Registration</h1>
            </div>
          </div>
          <p className="text-theme-muted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Create your Student Portal profile. Uploading/verification is handled by the GCJ administration.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="glass border border-theme-border/50 p-6 sm:p-8 rounded-3xl"
        >
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 border-b border-theme-border/40 pb-3">
            <User className="w-5 h-5 text-brand-gold" />
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="pt-5 space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-theme-light" />
                Full Name *</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Muhammad Abdullah"
                className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-3 px-4 text-xs text-theme-text outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-theme-light" />
                Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                placeholder="name@gcj.edu.pk"
                className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-3 px-4 text-xs text-theme-text outline-none transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-theme-light" />
                Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+92 300 1234567"
                className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-3 px-4 text-xs text-theme-text outline-none transition-all"
              />
            </div>

            {/* Roll No */}
            <div className="space-y-2">
              <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide flex items-center gap-2">
                <IdCard className="w-3.5 h-3.5 text-theme-light" />
                Roll / Student ID *</label>
              <input
                value={formData.roll_no}
                onChange={(e) => setFormData((p) => ({ ...p, roll_no: e.target.value }))}
                placeholder="GCJ-12345"
                className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-3 px-4 text-xs text-theme-text outline-none transition-all"
              />
            </div>

            {/* Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-theme-light" />
                  Department *</label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData((p) => ({ ...p, departmentId: e.target.value, courseId: '' }))}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-3 px-4 text-xs text-theme-text outline-none cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="" className="bg-theme-footer">{isLoading ? 'Loading...' : 'Select Department'}</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id} className="bg-theme-footer">
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Program (Optional)</label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData((p) => ({ ...p, courseId: e.target.value }))}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-3 px-4 text-xs text-theme-text outline-none cursor-pointer"
                  disabled={!formData.departmentId}
                >
                  <option value="" className="bg-theme-footer">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} className="bg-theme-footer">
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                placeholder="Set a password (min 4 chars)"
                className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-3 px-4 text-xs text-theme-text outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="w-full py-3.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover disabled:bg-theme-primary/50 text-white font-bold tracking-wider uppercase border border-theme-primary shadow-lg shadow-theme-primary/20 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
                </span>
              ) : (
                'Register'
              )}
            </button>

            <div className="text-center">
              <span className="text-[11px] text-theme-muted">
                Already have an account?{' '}
                <a className="text-brand-gold font-extrabold hover:underline" href="/portal/login">
                  Login
                </a>
              </span>
            </div>
          </form>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-5 p-4 rounded-xl border ${
                  feedback.type === 'error'
                    ? 'bg-red-500/10 text-red-300 border-red-500/20'
                    : 'bg-theme-primary-light/25 text-brand-gold border-brand-gold/30'
                }`}
              >
                <div className="flex items-start gap-2">
                  {feedback.type === 'error' ? (
                    <AlertCircle className="w-5 h-5 mt-0.5 text-red-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 mt-0.5 text-brand-gold" />
                  )}
                  <div>
                    <div className="text-xs font-bold">{feedback.type === 'error' ? 'Registration error' : 'Success'}</div>
                    <div className="text-xs opacity-90">{feedback.message}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="space-y-5"
        >
          <div className="glass border border-theme-border/50 p-6 sm:p-8 rounded-3xl">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-theme-border/40 pb-3">
              <CheckCircle2 className="w-5 h-5 text-brand-gold" />
              Registration checklist
            </h3>
            <ul className="mt-4 space-y-3 text-theme-muted text-sm">
              <li className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-gold mt-2" />
                <span>
                  Use a valid <span className="font-extrabold text-theme-text">email</span> and active <span className="font-extrabold text-theme-text">phone</span> number.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-gold mt-2" />
                <span>
                  Provide your <span className="font-extrabold text-theme-text">Roll / Student ID</span> for linking dashboard records.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-gold mt-2" />
                <span>
                  Choose your <span className="font-extrabold text-theme-text">department</span> and optionally program.
                </span>
              </li>
            </ul>
          </div>

          <div className="glass border border-theme-border/50 p-6 sm:p-8 rounded-3xl">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-theme-border/40 pb-3">
              <IdCard className="w-5 h-5 text-brand-gold" />
              Note
            </h3>
            <p className="text-theme-muted text-sm leading-relaxed">
              Backend registration endpoints can be wired later. The current implementation signs you in as a Student to demonstrate portal flow and role-based UI.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

