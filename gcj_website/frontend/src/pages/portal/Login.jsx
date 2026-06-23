import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, GraduationCap, UserCircle2, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';

function guessRoleFromIdentifier(identifier) {
  const id = (identifier || '').toLowerCase().trim();
  if (!id) return null;

  // Teacher/admin heuristics
  if (id.includes('teacher') || id.includes('faculty') || id.includes('hod') || id.includes('professor')) return 'teacher';
  if (id.includes('admin') || id.includes('controller') || id.includes('registrar')) return 'admin';

  // Student heuristics: roll numbers like GCJ-12345, or ends with gcj.edu.pk
  if (id.includes('gcj-') || id.includes('student') || id.endsWith('@gcj.edu.pk')) return 'student';

  // Default fallback
  return null;
}

function validateEmailLike(v) {
  return /.+@.+\..+/.test(v);
}

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [roleLocked, setRoleLocked] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const detectedRole = useMemo(() => guessRoleFromIdentifier(identifier), [identifier]);

  useEffect(() => {
    if (roleLocked) return;
    if (detectedRole) {
      setRole(detectedRole);
    }
  }, [detectedRole, roleLocked]);

  const isEmailLike = useMemo(() => validateEmailLike(identifier), [identifier]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!identifier || !password) {
      setFeedback({ type: 'error', message: 'Please enter your identifier and password.' });
      return;
    }

    setIsSubmitting(true);

    try {
      // No backend auth spec provided; use client-side demo auth.
      await new Promise((r) => setTimeout(r, 650));

      // Simulate success if password length >= 4
      if (String(password).length < 4) {
        setIsSubmitting(false);
        setFeedback({ type: 'error', message: 'Password is too short. Try again.' });
        return;
      }

      const token = btoa(JSON.stringify({ t: Date.now(), id: identifier, role })).slice(0, 24);
      const user = {
        id: identifier,
        name: role === 'student' ? 'Student Portal User' : role === 'teacher' ? 'Faculty Portal User' : 'Admin Portal User',
        email: isEmailLike ? identifier : `${identifier}@gcj.edu.pk`,
      };

      localStorage.setItem('gcj_token', token);
      localStorage.setItem('gcj_role', role);
      localStorage.setItem('gcj_user', JSON.stringify(user));

      setIsSubmitting(false);
      navigate(`/portal/${role}/dashboard`, { replace: true });
    } catch (err) {
      setIsSubmitting(false);
      setFeedback({ type: 'error', message: 'Login failed. Please try again.' });
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
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">Sign In</h1>
            </div>
          </div>
          <p className="text-theme-muted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Unified login for Students, Teachers, and Admin. Role is auto-detected from your identifier; you can override it instantly.
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
            <ShieldCheck className="w-5 h-5 text-brand-gold" />
            Secure Authentication
          </h2>

          <form onSubmit={handleSubmit} className="pt-5 space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-theme-light" />
                Email / Roll No / Username
              </label>
              <div className="relative">
                <input
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (roleLocked) return;
                  }}
                  placeholder="e.g. GCJ-12456 or name@gcj.edu.pk"
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-3 px-4 text-xs text-theme-text outline-none transition-all"
                  autoComplete="username"
                />
              </div>

              <AnimatePresence>
                {detectedRole && !roleLocked && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-theme-primary-light/20 border border-theme-border/60"
                  >
                    <Sparkles className="w-4 h-4 text-brand-gold" />
                    <span className="text-[11px] text-theme-muted">
                      Auto-detected role: <span className="font-extrabold text-theme-text capitalize">{detectedRole}</span>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-theme-light" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-3 px-4 text-xs text-theme-text outline-none transition-all"
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Role (override if needed)</label>
              <div className="grid grid-cols-3 gap-3">
                {['student', 'teacher', 'admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      setRoleLocked(true);
                    }}
                    className={`py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider border transition-all cursor-pointer ${
                      role === r
                        ? 'bg-theme-primary text-white border-theme-primary shadow shadow-theme-primary/20'
                        : 'bg-theme-primary-light/10 border-theme-border/60 text-theme-muted hover:text-theme-text hover:bg-theme-primary-light/30'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-theme-muted">
                {roleLocked ? (
                  <button
                    type="button"
                    className="underline text-brand-gold font-bold"
                    onClick={() => setRoleLocked(false)}
                  >
                    Re-enable auto-detect
                  </button>
                ) : (
                  <span>Auto-detect is active based on your identifier.</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover disabled:bg-theme-primary/50 text-white font-bold tracking-wider uppercase border border-theme-primary shadow-lg shadow-theme-primary/20 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                </span>
              ) : (
                'Login'
              )}
            </button>

            <div className="text-center">
              <span className="text-[11px] text-theme-muted">
                New to GCJ Portal?{' '}
                <a className="text-brand-gold font-extrabold hover:underline" href="/portal/register">
                  Register as a student
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
                  <UserCircle2 className="w-5 h-5 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold">{feedback.type === 'error' ? 'Login error' : 'Success'}</div>
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
              <Sparkles className="w-5 h-5 text-brand-gold" />
              What you get
            </h3>
            <ul className="mt-4 space-y-3 text-theme-muted text-sm">
              <li className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-gold mt-2" />
                <span>
                  <span className="font-extrabold text-theme-text">Role-based navigation</span> with animated sidebar.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-gold mt-2" />
                <span>
                  <span className="font-extrabold text-theme-text">Loading skeletons</span> for dashboard data.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-gold mt-2" />
                <span>
                  <span className="font-extrabold text-theme-text">GCJ branding</span> across the portal shell.
                </span>
              </li>
            </ul>
          </div>

          <div className="glass border border-theme-border/50 p-6 sm:p-8 rounded-3xl">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-theme-border/40 pb-3">
              <GraduationCap className="w-5 h-5 text-brand-gold" />
              Quick demo credentials
            </h3>
            <p className="text-theme-muted text-sm leading-relaxed">
              This frontend uses client-side demo auth until backend integration is specified. Any identifier + a password length ≥ 4 will sign you in.
              Role is auto-detected if your identifier contains patterns like <span className="font-extrabold text-theme-text">gcj-</span> (student) or <span className="font-extrabold text-theme-text">admin</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

