import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, User, Mail, Phone, IdCard, Building2 } from 'lucide-react';
import { api } from '../utils/api';

function FieldLabel({ children }) {
  return <div className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">{children}</div>;
}

function SkeletonCard() {
  return (
    <div className="glass border border-theme-border/60 rounded-3xl p-6">
      <div className="animate-pulse bg-theme-primary-light/30 rounded-xl h-8 w-2/3" />
      <div className="mt-4 animate-pulse bg-theme-primary-light/30 rounded-xl h-10 w-full" />
      <div className="mt-3 animate-pulse bg-theme-primary-light/30 rounded-xl h-10 w-full" />
      <div className="mt-6 animate-pulse bg-theme-primary-light/30 rounded-xl h-12 w-full" />
    </div>
  );
}

export default function Register() {
  const [loading, setLoading] = useState(true);
  const [depts, setDepts] = useState([]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    roll_no: '',
    department: '',
    course_id: '',
    password: '',
  });

  const [courses, setCourses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 650));
      if (!mounted) return;

      try {
        const d = await api.getDepartments();
        if (!mounted) return;
        setDepts(d);
      } catch {
        setDepts([]);
      }

      setLoading(false);
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadCourses() {
      if (!form.department) return;
      try {
        const all = await api.getCourses();
        if (!mounted) return;
        setCourses(all.filter((c) => c.department === Number(form.department)));
      } catch {
        if (!mounted) return;
        setCourses([]);
      }
    }
    loadCourses();
    return () => {
      mounted = false;
    };
  }, [form.department]);

  const submit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.roll_no.trim() || !form.department) {
      setFeedback({ type: 'error', message: 'Please fill all required fields.' });
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    // Demo registration: create session as student
    const token = `demo_token_${Date.now()}`;
    localStorage.setItem(
      'gcj_session',
      JSON.stringify({
        token,
        role: 'student',
        user: { name: form.name.trim(), email: form.email.trim(), roll_no: form.roll_no.trim() },
      })
    );
    localStorage.setItem('gcj_token', token);

    setSubmitting(false);
    setFeedback({ type: 'success', message: 'Registration complete. Redirecting to dashboard…' });
    setTimeout(() => {
      window.location.href = '/portal/student';
    }, 600);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="w-full max-w-md">
          <SkeletonCard />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-2xl"
      >
        <div className="relative overflow-hidden rounded-3xl glass border border-theme-border/60">
          <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/15 via-transparent to-brand-gold/10 pointer-events-none" />

          <div className="relative p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-theme-primary to-brand-gold flex items-center justify-center shadow-lg shadow-theme-primary/20">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-white font-extrabold text-2xl">Student Registration</div>
                <div className="text-theme-muted text-sm mt-1">Create your GCJ student portal access.</div>
              </div>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FieldLabel>
                    <span className="inline-flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-brand-gold" /> Full Name *
                    </span>
                  </FieldLabel>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-3 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel>
                    <span className="inline-flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-brand-gold" /> Email *
                    </span>
                  </FieldLabel>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-3 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel>
                    <span className="inline-flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-brand-gold" /> Phone *
                    </span>
                  </FieldLabel>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-3 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel>
                    <span className="inline-flex items-center gap-2">
                      <IdCard className="w-3.5 h-3.5 text-brand-gold" /> Roll No *
                    </span>
                  </FieldLabel>
                  <input
                    value={form.roll_no}
                    onChange={(e) => setForm((p) => ({ ...p, roll_no: e.target.value }))}
                    className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-3 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                    required
                    placeholder="e.g. GCJ-31045"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FieldLabel>
                    <span className="inline-flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-brand-gold" /> Department *
                    </span>
                  </FieldLabel>
                  <select
                    value={form.department}
                    onChange={(e) => setForm((p) => ({ ...p, department: e.target.value, course_id: '' }))}
                    className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-3 px-3 text-xs text-theme-text outline-none focus:border-brand-gold cursor-pointer appearance-none"
                    required
                  >
                    <option value="" className="bg-theme-footer">Select department</option>
                    {depts.map((d) => (
                      <option key={d.id} value={d.id} className="bg-theme-footer">{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Course (Optional)</div>
                  <select
                    value={form.course_id}
                    onChange={(e) => setForm((p) => ({ ...p, course_id: e.target.value }))}
                    disabled={!form.department}
                    className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-3 px-3 text-xs text-theme-text outline-none focus:border-brand-gold cursor-pointer disabled:opacity-50 appearance-none"
                  >
                    <option value="" className="bg-theme-footer">Select course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id} className="bg-theme-footer">{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Password (for demo portal access)</div>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-3 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                  placeholder="Set any password"
                />
              </div>

              {feedback && (
                <div
                  className={`p-4 rounded-xl border text-xs ${
                    feedback.type === 'success'
                      ? 'bg-green-500/10 text-green-300 border-green-500/20'
                      : 'bg-red-500/10 text-red-300 border-red-500/20'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover disabled:bg-theme-primary/60 text-white text-xs font-extrabold uppercase tracking-wider border border-theme-primary/30 shadow-lg shadow-theme-primary/20 cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {submitting ? 'Registering…' : 'Create Account'}
              </button>

              <div className="text-theme-muted text-xs flex items-center justify-between gap-3">
                <span>Already registered? <a href="/portal/login" className="text-brand-gold font-extrabold hover:underline">Login</a></span>
                <span>Unified portal UI • GCJ Branding</span>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

