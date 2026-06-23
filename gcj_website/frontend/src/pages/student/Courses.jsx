import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap } from 'lucide-react';
import { api } from '../../utils/api';

function SkeletonLine() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-xl h-12" />;
}

export default function Courses() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await api.getCourses();
        if (!mounted) return;
        setCourses(data.slice(0, 7));
      } catch {
        if (!mounted) return;
        setCourses([]);
      } finally {
        if (mounted) setLoading(false);
      }
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
          <div className="space-y-2">
            <h2 className="text-white font-extrabold text-xl">Courses</h2>
            <p className="text-theme-muted text-sm">Enrolled courses list with program overview.</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-theme-primary-light/15 border border-theme-border/60">
            <BookOpen className="w-4 h-4 text-brand-gold" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-theme-light">Enrolled</span>
          </div>
        </div>
      </motion.section>

      {loading ? (
        <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
          <div className="space-y-3">
            <SkeletonLine />
            <SkeletonLine />
          </div>
        </div>
      ) : courses.length ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {courses.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-theme-primary-light/15 border border-theme-border/60">
                    <GraduationCap className="w-4 h-4 text-brand-gold" />
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-theme-light">{c.code}</span>
                  </div>
                  <h3 className="text-white font-extrabold text-lg leading-snug">{c.name}</h3>
                  <p className="text-theme-muted text-sm leading-relaxed">{c.eligibility || 'Eligibility and fee details available.'}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-theme-primary-light/10 border border-theme-border/60 rounded-2xl p-3">
                  <div className="text-[10px] text-theme-light uppercase tracking-widest font-extrabold">Semester</div>
                  <div className="text-white font-extrabold text-sm mt-1">{c.semester ?? '—'}</div>
                </div>
                <div className="bg-theme-primary-light/10 border border-theme-border/60 rounded-2xl p-3">
                  <div className="text-[10px] text-theme-light uppercase tracking-widest font-extrabold">Credits</div>
                  <div className="text-white font-extrabold text-sm mt-1">{c.credit_hours ?? '—'}</div>
                </div>
                <div className="bg-theme-primary-light/10 border border-theme-border/60 rounded-2xl p-3">
                  <div className="text-[10px] text-theme-light uppercase tracking-widest font-extrabold">Duration</div>
                  <div className="text-white font-extrabold text-sm mt-1">{c.duration ?? '—'}</div>
                </div>
              </div>

              <div className="mt-4 text-xs">
                <span className="text-theme-muted">Fee: </span>
                <span className="font-extrabold text-brand-gold">{c.fee || '—'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6 text-theme-muted text-sm">No courses enrolled.</div>
      )}
    </div>
  );
}

