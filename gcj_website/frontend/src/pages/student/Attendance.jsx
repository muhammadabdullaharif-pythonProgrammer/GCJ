import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CalendarDays } from 'lucide-react';

// Lightweight chart without external Chart.js (works even if Chart.js isn't installed)
function AttendanceBars({ data }) {
  const max = Math.max(...data.map((d) => d.percent));
  return (
    <div className="space-y-3">
      {data.map((d) => {
        const w = max === 0 ? 0 : (d.percent / max) * 100;
        return (
          <div key={d.label} className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-theme-muted font-extrabold uppercase tracking-wider">{d.label}</span>
              <span className="text-white font-extrabold">{d.percent}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-theme-primary-light/10 border border-theme-border/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-gold/80 to-theme-primary/80"
                style={{ width: `${w}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6 h-[420px]">
      <div className="animate-pulse bg-theme-primary-light/30 rounded-xl h-8 w-2/3" />
      <div className="mt-4 animate-pulse bg-theme-primary-light/30 rounded-xl h-56 w-full" />
    </div>
  );
}

export default function Attendance() {
  const [loading, setLoading] = useState(true);
  const [weekly, setWeekly] = useState([]);
  const [overall, setOverall] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 650));
      if (!mounted) return;

      const data = [
        { label: 'Week 1', percent: 78 },
        { label: 'Week 2', percent: 84 },
        { label: 'Week 3', percent: 76 },
        { label: 'Week 4', percent: 88 },
        { label: 'Week 5', percent: 81 },
      ];

      const avg = data.reduce((a, b) => a + b.percent, 0) / data.length;

      setWeekly(data);
      setOverall(avg);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const chartCardData = useMemo(() => weekly, [weekly]);

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
            <h2 className="text-white font-extrabold text-xl flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-gold" /> Attendance
            </h2>
            <p className="text-theme-muted text-sm">Attendance percentage overview with chart-like visualization.</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-theme-primary-light/15 border border-theme-border/60 text-theme-muted text-xs font-extrabold uppercase tracking-wider">
            <CalendarDays className="w-4 h-4 text-brand-gold" /> Overall: {overall ? overall.toFixed(1) : '—'}%
          </div>
        </div>
      </motion.section>

      {loading ? (
        <SkeletonCard />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7">
            <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6 h-[420px]">
              <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">Weekly Attendance</div>
              <div className="mt-4 h-[360px] overflow-auto pr-1">
                <AttendanceBars data={chartCardData} />
              </div>
            </div>
          </div>
          <div className="xl:col-span-5">
            <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
              <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">Insights</div>
              <div className="mt-4 space-y-4">
                <div className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                  <div className="text-white font-extrabold text-sm">Target Recommendation</div>
                  <div className="text-theme-muted text-sm mt-2">
                    Aim for <span className="font-extrabold text-theme-text">≥ 85%</span> next week to maintain a strong semester record.
                  </div>
                </div>
                <div className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                  <div className="text-white font-extrabold text-sm">Best Performing Week</div>
                  <div className="text-theme-muted text-sm mt-2">
                    {weekly.length ? (
                      (() => {
                        const best = weekly.reduce((a, b) => (b.percent > a.percent ? b : a));
                        return (
                          <>
                            <span className="font-extrabold text-theme-text">{best.label}</span> ({best.percent}%).
                          </>
                        );
                      })()
                    ) : (
                      '—'
                    )}
                  </div>
                </div>
                <div className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                  <div className="text-white font-extrabold text-sm">Next Steps</div>
                  <ul className="text-theme-muted text-sm mt-2 list-disc pl-5 space-y-1">
                    <li>Mark attendance concerns early.</li>
                    <li>Review missed lecture summaries.</li>
                    <li>Use AI Advisor for revision guidance.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

