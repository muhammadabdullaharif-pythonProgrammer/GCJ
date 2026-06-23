import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Bell, ClipboardList, LayoutDashboard, BookOpen } from 'lucide-react';

function SkeletonLine() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-2xl h-14" />;
}

function StatCard({ label, value, icon }) {
  return (
    <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">{label}</div>
          <div className="text-white font-extrabold text-3xl mt-2">{value}</div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-brand-gold/15 border border-brand-gold/20 text-brand-gold flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({ classes: 4, students: 142, announcements: 5, pending: 2 });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 700));
      if (!mounted) return;
      setOverview({ classes: 4, students: 142, announcements: 5, pending: 2 });
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
          <div>
            <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">Teacher Portal</div>
            <h2 className="text-white font-extrabold text-3xl mt-2">Teacher Overview</h2>
            <p className="text-theme-muted text-sm mt-2">Classes, students, and announcement updates.</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-theme-primary-light/15 border border-theme-border/60 text-theme-muted text-xs font-extrabold uppercase tracking-wider">
            <LayoutDashboard className="w-4 h-4 text-brand-gold" /> Live
          </div>
        </div>
      </motion.section>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard label="Classes" value={overview.classes} icon={<BookOpen className="w-5 h-5" />} />
          <StatCard label="Students" value={overview.students} icon={<Users className="w-5 h-5" />} />
          <StatCard label="Announcements" value={overview.announcements} icon={<Bell className="w-5 h-5" />} />
          <StatCard label="Pending Tasks" value={overview.pending} icon={<ClipboardList className="w-5 h-5" />} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="text-white font-extrabold">Today’s Focus</div>
            <div className="text-theme-muted text-sm mt-1">Actionable items to manage your academic workflow.</div>

            <div className="mt-4 space-y-3">
              {[
                { title: 'Upload assignment solutions', desc: 'Make sure your class notes are up to date.' },
                { title: 'Enter marks for quizzes', desc: 'Review pending marks entry for Semester Spring 2026.' },
                { title: 'Post an announcement', desc: 'Notify students about next lab schedule.' },
              ].map((x, i) => (
                <div key={i} className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                  <div className="text-white font-extrabold text-sm">{x.title}</div>
                  <div className="text-theme-muted text-sm mt-2">{x.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-5">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="text-white font-extrabold">Quick Links</div>
            <div className="text-theme-muted text-sm mt-1">Go directly to common teacher tasks.</div>

            <div className="mt-4 space-y-3">
              {[
                { label: 'Assignments', to: '/portal/teacher/assignments' },
                { label: 'Marks', to: '/portal/teacher/marks' },
                { label: 'Timetable', to: '/portal/teacher/timetable' },
                { label: 'Notices', to: '/portal/teacher/notices' },
              ].map((x) => (
                <a key={x.to} href={x.to} className="block bg-theme-primary-light/10 border border-theme-border/60 hover:bg-theme-primary-light/20 rounded-3xl p-4 transition-colors">
                  <div className="text-white font-extrabold text-sm">{x.label}</div>
                  <div className="text-theme-muted text-sm mt-2">Open module</div>
                </a>
              ))}
            </div>

            <div className="mt-5 text-theme-muted text-xs">
              Use portal pages to manage assignments, marks, notices and timetable.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

