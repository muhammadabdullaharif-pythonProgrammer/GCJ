import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, AlertCircle, Search } from 'lucide-react';

function SkeletonRow() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-2xl h-16" />;
}

export default function Admissions() {
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState([]);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 650));
      if (!mounted) return;

      setApps([
        { id: 11, student: { roll_no: 'GCJ-31011', name: 'M. Ali' }, department: 'CS & IT', merit_score: 86.2, status: 'Applied', applied_date: '2026-06-10' },
        { id: 12, student: { roll_no: 'GCJ-31012', name: 'Ayesha Sohail' }, department: 'Chemistry', merit_score: 78.6, status: 'Pending', applied_date: '2026-06-13' },
        { id: 13, student: { roll_no: 'GCJ-31013', name: 'Usman Khan' }, department: 'Physics', merit_score: 92.1, status: 'Accepted', applied_date: '2026-06-14' },
        { id: 14, student: { roll_no: 'GCJ-31014', name: 'Sara Raza' }, department: 'Math', merit_score: 81.4, status: 'Pending', applied_date: '2026-06-15' },
      ]);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) => {
      const matchQ = !q || a.student.roll_no.toLowerCase().includes(q) || a.student.name.toLowerCase().includes(q);
      const matchS = status === 'All' || a.status === status;
      return matchQ && matchS;
    });
  }, [apps, query, status]);

  const updateStatus = (id, next) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: next } : a)));
  };

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6"
      >
        <div className="space-y-2">
          <h2 className="text-white font-extrabold text-xl">Admissions Review</h2>
          <p className="text-theme-muted text-sm">Application review + status update (demo).</p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-12">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
              <h3 className="text-white font-extrabold">Applications</h3>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by roll or name"
                    className="w-full pl-10 bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                  />
                </div>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold cursor-pointer"
                >
                  {['All', 'Applied', 'Pending', 'Accepted', 'Rejected'].map((s) => (
                    <option key={s} value={s} className="bg-theme-footer">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : filtered.length ? (
                filtered.map((a) => {
                  const isAccepted = a.status === 'Accepted';
                  const isRejected = a.status === 'Rejected';

                  return (
                    <div key={a.id} className="flex items-start justify-between gap-4 bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-brand-gold" />
                          <div className="text-white font-extrabold text-sm">{a.student.name}</div>
                        </div>
                        <div className="text-theme-muted text-xs mt-1">{a.student.roll_no} • {a.department}</div>
                        <div className="text-theme-muted text-xs mt-2">
                          Merit: <span className="font-extrabold text-theme-text">{a.merit_score.toFixed(2)}</span>
                        </div>
                        <div className="text-theme-muted text-xs mt-2">
                          Applied: <span className="font-extrabold text-theme-text">{a.applied_date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-col sm:flex-row">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${
                            isAccepted
                              ? 'bg-green-500/10 text-green-300 border-green-500/20'
                              : isRejected
                              ? 'bg-red-500/10 text-red-300 border-red-500/20'
                              : 'bg-brand-gold/10 text-brand-gold border-brand-gold/20'
                          }`}
                        >
                          {isAccepted ? <CheckCircle2 className="w-4 h-4" /> : isRejected ? <AlertCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          {a.status}
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => updateStatus(a.id, 'Accepted')}
                            className="px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/15 text-green-200 text-xs font-extrabold uppercase tracking-wider cursor-pointer"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStatus(a.id, 'Rejected')}
                            className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 text-red-200 text-xs font-extrabold uppercase tracking-wider cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-theme-muted text-sm">No applications found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

