import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Shield, User, Mail, Lock, UserRound, LogIn } from 'lucide-react';

function detectRoleFromIdentifier(identifier) {
  const s = (identifier || '').toLowerCase();
  if (s.includes('admin')) return 'admin';
  if (s.includes('teacher') || s.includes('hod') || s.includes('@teacher') || s.includes('faculty')) return 'teacher';
  // Common student patterns (roll no prefix / student email)
  if (s.includes('student') || s.includes('gcj-3') || s.includes('roll')) return 'student';
  if (s.includes('@gcj.edu.pk')) return 'student';
  return null;
}

function SkeletonAuth() {
  return (
    <div className="glass border border-theme-border/60 rounded-3xl p-6">
      <div className="animate-pulse bg-theme-primary-light/30 rounded-xl h-8 w-2/3" />
      <div className="mt-4 animate-pulse bg-theme-primary-light/30 rounded-xl h-10 w-full" />
      <div className="mt-3 animate-pulse bg-theme-primary-light/30 rounded-xl h-10 w-full" />
      <div className="mt-6 animate-pulse bg-theme-primary-light/30 rounded-xl h-12 w-full" />
    </div>
  );
}

export default function Login() {
  const [loading, setLoading] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [role, setRole] = useState('');
  const [autoDetected, setAutoDetected] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const detected = detectRoleFromIdentifier(identifier);
    setAutoDetected(detected);
    if (detected) setRole(detected);
  }, [identifier]);

  const brandHint = useMemo(() => {
    if (!autoDetected) return 'We will auto-detect your portal role from email/ID.';
    return `Auto-detected role: ${autoDetected.toUpperCase()}`;
  }, [autoDetected]);

  const submit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!identifier.trim() || !password.trim()) {
      setFeedback({ type: 'error', message: 'Email/ID and password are required.' });
      return;
    }

    if (!role) {
      setFeedback({ type: 'error', message: 'Role could not be detected. Please select your role.' });
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    // Demo auth: accept any credentials and create a session
    const token = `demo_token_${Date.now()}`;
    const session = {
      token,
      role,
      user: {
        name: 'GCJ User',
        email: identifier.trim(),
      },
    };

    localStorage.setItem('gcj_session', JSON.stringify(session));
    localStorage.setItem('gcj_token', token);
    setSubmitting(false);

    window.location.href = `/portal/${role}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <SkeletonAuth />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-3xl glass border border-theme-border/60">
          <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/15 via-transparent to-brand-gold/10 pointer-events-none" />

          <div className="relative p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-theme-primary to-brand-gold flex items-center justify-center shadow-lg shadow-theme-primary/20">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>

              <div className="flex-1">
                <div className="text-white font-extrabold text-2xl">GCJ Portal Login</div>
                <div className="text-theme-muted text-sm mt-1">Unified login with role auto-detect.</div>
                <div className="text-brand-gold text-xs font-extrabold uppercase tracking-wider mt-2">{brandHint}</div>
              </div>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-brand-gold" /> Email or ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. student@gcj.edu.pk or GCJ-31045"
                    className="w-full pl-10 bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-3 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-brand-gold" /> Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-3 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-brand-gold" /> Role
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { r: 'student', label: 'Student', icon: <UserRound className="w-4 h-4" /> },
                    { r: 'teacher', label: 'Teacher', icon: <UserRound className="w-4 h-4" /> },
                    { r: 'admin', label: 'Admin', icon: <UserRound className="w-4 h-4" /> },
                  ].map((x) => (
                    <button
                      key={x.r}
                      type="button"
                      onClick={() => setRole(x.r)}
                      className={`rounded-2xl py-3 text-xs font-extrabold uppercase tracking-wider border cursor-pointer transition-colors flex flex-col items-center justify-center gap-1 ${
                        role === x.r
                          ? 'bg-theme-primary text-white border-theme-primary/30'
                          : 'bg-theme-primary-light/10 border-theme-border/60 hover:bg-theme-primary-light/20 text-theme-text'
                      }`}
                    >
                      {x.icon}
                      {x.label}
                    </button>
                  ))}
                </div>

                {autoDetected && (
                  <div className="text-theme-muted text-xs mt-2">
                    Role was auto-detected. You can change it if needed.
                  </div>
                )}
              </div>

              {feedback && (
                <div
                  className={`p-4 rounded-xl border text-xs ${
                    feedback.type === 'error'
                      ? 'bg-red-500/10 text-red-300 border-red-500/20'
                      : 'bg-green-500/10 text-green-300 border-green-500/20'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover disabled:bg-theme-primary/60 text-white text-xs font-extrabold uppercase tracking-wider border border-theme-primary/30 shadow-lg shadow-theme-primary/20 cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {submitting ? 'Signing in…' : 'Sign In'}
              </motion.button>

              <div className="flex items-center justify-between gap-3">
                <div className="text-theme-muted text-xs">No account? <a href="/portal/register" className="text-brand-gold font-extrabold hover:underline">Register</a></div>
                <div className="text-theme-muted text-xs">Demo login supports any credentials.</div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

