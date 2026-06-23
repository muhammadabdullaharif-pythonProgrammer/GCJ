import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, ShieldCheck, Clock, TrendingUp, Loader2 } from 'lucide-react';

function SkeletonPanel() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-3xl h-44" />;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 4120,
    teachers: 132,
    departments: 6,
    admissionsToday: 48,
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 700));
      if (!mounted) return;

      setStats({
        students: 4120,
        teachers: 132,
        departments: 6,
        admissionsToday: 48,
      });

      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const counter = useMemo(() => {
    // animate-like derived values
    return {
      admissionsToday: stats.admissionsToday,
    };
  }, [stats.admissionsToday]);

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
            <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">Admin Portal</div>
            <h2 className="text-white font-extrabold text-3xl mt-2">Full Analytics</h2>
            <p className="text-theme-muted text-sm mt-2">Charts, stats, and real-time counters (demo).</p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-theme-primary-light/15 border border-theme-border/60 text-theme-muted text-xs font-extrabold uppercase tracking-wider">
            <Clock className="w-4 h-4 text-brand-gold" /> Live
          </div>
        </div>
      </motion.section>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <SkeletonPanel />
          <SkeletonPanel />
          <SkeletonPanel />
          <SkeletonPanel />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">Total Students</div>
                <div className="text-white font-extrabold text-3xl mt-2">{stats.students.toLocaleString()}</div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-brand-gold/15 border-brand-gold/20 text-brand-gold flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">Total Teachers</div>
                <div className="text-white font-extrabold text-3xl mt-2">{stats.teachers}</div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-brand-gold/15 border-brand-gold/20 text-brand-gold flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">Departments</div>
                <div className="text-white font-extrabold text-3xl mt-2">{stats.departments}</div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-brand-gold/15 border-brand-gold/20 text-brand-gold flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">Admissions Today</div>
                <div className="text-white font-extrabold text-3xl mt-2">{counter.admissionsToday}</div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-brand-gold/15 border-brand-gold/20 text-brand-gold flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-white font-extrabold">Trend Overview</div>
                <div className="text-theme-muted text-sm mt-1">A simple trend visualization (demo).</div>
              </div>
            </div>

            <div className="mt-4 h-[260px] flex items-end gap-2 overflow-hidden">
              {[
                { h: 64, c: 'rgba(212, 175, 55, 0.35)' },
                { h: 78, c: 'rgba(212, 175, 55, 0.35)' },
                { h: 58, c: 'rgba(30, 64, 175, 0.25)' },
                { h: 86, c: 'rgba(212, 175, 55, 0.35)' },
                { h: 72, c: 'rgba(30, 64, 175, 0.25)' },
                { h: 92, c: 'rgba(212, 175, 55, 0.35)' },
              ].map((b, i) => (
                <div key={i} className="flex-1 rounded-3xl border border-theme-border/60 bg-theme-primary-light/10 overflow-hidden">
                  <div style={{ height: `${b.h}%`, background: b.c }} className="w-full rounded-3xl" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6 h-full">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-white font-extrabold">Realtime Counters</div>
                <div className="text-theme-muted text-sm mt-1">Auto-updating counters (demo).</div>
              </div>
              <div className="text-theme-muted text-xs font-extrabold uppercase tracking-wider">Status</div>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { label: 'New applicants', value: stats.admissionsToday, tone: 'gold' },
                { label: 'Notices posted', value: 12, tone: 'blue' },
                { label: 'AI chats today', value: 96, tone: 'gold' },
              ].map((x, i) => (
                <div key={i} className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white font-extrabold text-sm">{x.label}</div>
                    <div className="text-theme-muted text-xs mt-1">Last 24 hours</div>
                  </div>
                  <div className="text-white font-extrabold text-2xl">{x.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 text-theme-muted text-xs">Use Analytics module for detailed charts.</div>
          </div>
        </div>
      </div>

      <div className="text-theme-muted text-xs">
        Note: This dashboard uses demo counters. When backend endpoints are connected, the same cards can be wired to real APIs.
      </div>
    </div>
  );
}

