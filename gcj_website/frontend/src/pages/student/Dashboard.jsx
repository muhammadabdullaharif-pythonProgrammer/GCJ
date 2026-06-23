import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, CalendarClock, BookOpen, Bell, Sparkles } from 'lucide-react';

function SkeletonCard() {
  return (
    <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6 animate-pulse">
      <div className="bg-theme-primary-light/30 rounded-xl h-6 w-2/3" />
      <div className="mt-4 bg-theme-primary-light/30 rounded-xl h-10 w-1/2" />
    </div>
  );
}

function StatCard({ label, value, icon, tone = 'gold' }) {
  const iconBg =
    tone === 'gold'
      ? 'bg-brand-gold/15 border-brand-gold/20 text-brand-gold'
      : tone === 'blue'
      ? 'bg-theme-primary/15 border-theme-primary/20 text-theme-primary'
      : 'bg-theme-primary-light/20 border-theme-border/60 text-theme-muted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">{label}</div>
          <div className="text-white font-extrabold text-3xl mt-2">{value}</div>
        </div>
        <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${iconBg}`}>{icon}</div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: 'Muhammad Abdullah', roll_no: 'GCJ-31045' });
  const [stats, setStats] = useState({ attendance: 84.2, cgpa: 3.42, courses: 5, notifications: 3 });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 700));
      if (!mounted) return;
      setProfile({ name: 'Muhammad Abdullah', roll_no: 'GCJ-31045' });
      setStats({ attendance: 84.2, cgpa: 3.42, courses: 5, notifications: 3 });
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const welcome = useMemo(() => {
    const now = new Date();
    const hr = now.getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6"
        >
          <div className="animate-pulse bg-theme-primary-light/30 rounded-xl h-10 w-2/3" />
          <div className="mt-3 animate-pulse bg-theme-primary-light/30 rounded-xl h-6 w-1/2" />
        </motion.section>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6 overflow-hidden relative"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand-gold/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
            <div>
              <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">
                {welcome} • Student Portal
              </div>
              <h2 className="text-white font-extrabold text-3xl mt-2">
                Welcome, {profile.name}
              </h2>
              <p className="text-theme-muted text-sm mt-2">Roll No: <span className="font-extrabold text-theme-text">{profile.roll_no}</span></p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-theme-primary-light/15 border border-theme-border/60 text-theme-muted text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              Live Dashboard
            </div>
          </div>

          <div className="mt-6 text-xs text-theme-muted">
            Quick actions below help you navigate courses, results, attendance, notices and advisor.
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          label="Attendance"
          value={`${stats.attendance.toFixed(1)}%`}
          icon={<CalendarClock className="w-5 h-5" />}
          tone="blue"
        />
        <StatCard
          label="Current CGPA"
          value={stats.cgpa.toFixed(2)}
          icon={<GraduationCap className="w-5 h-5" />}
          tone="gold"
        />
        <StatCard
          label="Enrolled Courses"
          value={stats.courses}
          icon={<BookOpen className="w-5 h-5" />}
          tone="blue"
        />
        <StatCard
          label="Notifications"
          value={stats.notifications}
          icon={<Bell className="w-5 h-5" />}
          tone="gold"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
              <div>
                <div className="text-white font-extrabold">Quick Actions</div>
                <div className="text-theme-muted text-sm mt-1">Jump to the most used student sections.</div>
              </div>
              <div className="text-theme-muted text-xs font-extrabold uppercase tracking-wider">Recommended</div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Profile', desc: 'View & update your details', to: '/portal/student/profile' },
                { title: 'Courses', desc: 'Your enrolled courses', to: '/portal/student/courses' },
                { title: 'Results', desc: 'Semester-wise performance', to: '/portal/student/results' },
                { title: 'Attendance', desc: 'Attendance percentage charts', to: '/portal/student/attendance' },
                { title: 'Notices', desc: 'Student notice board', to: '/portal/student/notices' },
                { title: 'AI Advisor', desc: 'Ask admission and study questions', to: '/portal/student/advisor' },
                { title: 'Fee Status', desc: 'Payment history and dues', to: '/portal/student/fees' },
              ].map((a) => (
                <a
                  key={a.to}
                  href={a.to}
                  className="group bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4 hover:bg-theme-primary-light/20 transition-colors"
                >
                  <div className="text-white font-extrabold text-sm group-hover:text-brand-gold">{a.title}</div>
                  <div className="text-theme-muted text-sm mt-2 group-hover:text-theme-text">{a.desc}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-5">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="text-white font-extrabold">Next on your agenda</div>
            <div className="text-theme-muted text-sm mt-1">Smart reminders based on your status (demo).</div>

            <div className="mt-4 space-y-3">
              {[
                { title: 'Review Attendance', desc: 'Aim for ≥ 85% next week to stay on track.', tone: 'gold' },
                { title: 'Check Fee Status', desc: 'Fall 2026 tuition fee due is approaching.', tone: 'blue' },
                { title: 'Read Notices', desc: 'Latest student notices available in Notice board.', tone: 'gold' },
              ].map((x, idx) => (
                <div key={idx} className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                  <div className="text-white font-extrabold text-sm">{x.title}</div>
                  <div className="text-theme-muted text-sm mt-2">{x.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 text-theme-muted text-xs">
              Data fetching skeletons will show while loading dynamic portal content.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

