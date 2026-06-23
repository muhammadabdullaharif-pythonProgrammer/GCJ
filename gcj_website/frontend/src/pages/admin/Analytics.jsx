import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Loader2, TrendingUp } from 'lucide-react';

// Note: Chart.js / react-chartjs-2 are not installed in this repo build.
// This component uses lightweight, chart-like SVG bars/lines instead.

export default function Analytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const admissionTrends = useMemo(() => {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Admission applications',
          data: [110, 125, 138, 152, 165, 178],
          backgroundColor: 'rgba(212, 175, 55, 0.35)',
          borderColor: 'rgba(212, 175, 55, 0.9)',
          borderWidth: 1,
          borderRadius: 10,
        },
      ],
    };
  }, []);

  const deptPopularity = useMemo(() => {
    return {
      labels: ['CS & IT', 'Chemistry', 'Physics', 'English', 'Math', 'Commerce'],
      datasets: [
        {
          label: 'Department popularity',
          data: [64, 41, 38, 26, 52, 33],
          fill: true,
          backgroundColor: 'rgba(30, 64, 175, 0.12)',
          borderColor: 'rgba(30, 64, 175, 0.85)',
          tension: 0.35,
          pointRadius: 3,
        },
      ],
    };
  }, []);

  const aiPredictions = useMemo(() => {
    return {
      labels: ['CS', 'Chem', 'Physics', 'English', 'Math', 'Commerce'],
      datasets: [
        {
          label: 'AI predicted demand',
          data: [78, 52, 49, 33, 61, 46],
          backgroundColor: 'rgba(30, 64, 175, 0.22)',
          borderColor: 'rgba(30, 64, 175, 0.85)',
          borderWidth: 1,
          borderRadius: 10,
        },
      ],
    };
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#9ca3af' } },
    },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(148,163,184,0.15)' } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(148,163,184,0.15)' } },
    },
  };

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
            <h2 className="text-white font-extrabold text-xl flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-gold" /> Analytics
            </h2>
            <p className="text-theme-muted text-sm">Admission trends, department popularity, and AI predictions.</p>
          </div>
          <div className="inline-flex items-center gap-2 text-theme-muted text-xs">
            <TrendingUp className="w-4 h-4 text-brand-gold" /> Admin
          </div>
        </div>
      </motion.section>

      {loading ? (
        <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6 h-[340px]">
              <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">Admission Trends</div>
              <div className="mt-3 h-[290px]">
                <svg viewBox="0 0 300 220" className="w-full h-full">
                  {admissionTrends.data.map((v, idx) => {
                    const max = Math.max(...admissionTrends.data);
                    const h = max === 0 ? 0 : (v / max) * 190;
                    return (
                      <rect
                        key={idx}
                        x={10 + idx * 45}
                        y={210 - h}
                        width={30}
                        height={h}
                        rx={8}
                        fill="rgba(212, 175, 55, 0.35)"
                        stroke="rgba(212, 175, 55, 0.9)"
                        strokeWidth={1}
                      />
                    );
                  })}
                </svg>

              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6 h-[340px]">
              <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">Department Popularity</div>
              <div className="mt-3 h-[290px]">
                <svg viewBox="0 0 300 220" className="w-full h-full">
                  {(() => {
                    const data = deptPopularity.datasets[0].data;
                    const max = Math.max(...data);
                    const points = data.map((v, i) => {
                      const x = 20 + i * (260 / (data.length - 1));
                      const y = 200 - (max === 0 ? 0 : (v / max) * 160);
                      return { x, y, v };
                    });
                    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                    return (
                      <>
                        <path d={d} fill="none" stroke="rgba(30, 64, 175, 0.85)" strokeWidth="3" />
                        {points.map((p, idx) => (
                          <circle key={idx} cx={p.x} cy={p.y} r={6} fill="rgba(212, 175, 55, 0.35)" stroke="rgba(30, 64, 175, 0.85)" strokeWidth="2" />
                        ))}
                      </>
                    );
                  })()}
                </svg>

              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6 h-[340px]">
              <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">AI Predictions</div>
              <div className="mt-3 h-[290px]">
                <svg viewBox="0 0 300 220" className="w-full h-full">
                  {aiPredictions.datasets[0].data.map((v, idx) => {
                    const arr = aiPredictions.datasets[0].data;
                    const max = Math.max(...arr);
                    const h = max === 0 ? 0 : (v / max) * 190;
                    return (
                      <rect
                        key={idx}
                        x={10 + idx * 45}
                        y={210 - h}
                        width={30}
                        height={h}
                        rx={8}
                        fill="rgba(30, 64, 175, 0.22)"
                        stroke="rgba(30, 64, 175, 0.85)"
                        strokeWidth={1}
                      />
                    );
                  })}
                </svg>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

