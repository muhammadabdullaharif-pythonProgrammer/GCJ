import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Search, Save } from 'lucide-react';

function SkeletonRow() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-3xl h-16" />;
}

export default function Marks() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 650));
      if (!mounted) return;

      setRows([
        { id: 1, student: 'Ayesha Sohail', roll_no: 'GCJ-31012', course: 'BS-CS', quiz: 'Quiz 1', marks: 18, out_of: 25 },
        { id: 2, student: 'Usman Khan', roll_no: 'GCJ-31013', course: 'BS-CS', quiz: 'Quiz 1', marks: 21, out_of: 25 },
        { id: 3, student: 'Sara Raza', roll_no: 'GCJ-31014', course: 'BS-CS', quiz: 'Quiz 1', marks: 16, out_of: 25 },
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
    if (!q) return rows;
    return rows.filter((r) => r.student.toLowerCase().includes(q) || r.roll_no.toLowerCase().includes(q) || r.course.toLowerCase().includes(q));
  }, [rows, query]);

  const setMarks = (id, val) => {
    const num = Number(val);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, marks: Number.isFinite(num) ? num : r.marks } : r)));
  };

  const save = async () => {
    setFeedback(null);
    await new Promise((r) => setTimeout(r, 600));
    setFeedback({ type: 'success', message: 'Marks updated successfully (demo).' });
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
          <h2 className="text-white font-extrabold text-xl flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-brand-gold" /> Marks Entry
          </h2>
          <p className="text-theme-muted text-sm">Enter and update marks (demo).</p>
        </div>
      </motion.section>

      <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
          <div className="space-y-1">
            <div className="text-white font-extrabold">Student Records</div>
            <div className="text-theme-muted text-sm">Edit marks then save.</div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, roll no, course"
              className="w-full pl-10 bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
            />
          </div>
        </div>

        {feedback && (
          <div
            className={`mt-4 p-4 rounded-xl border text-xs ${
              feedback.type === 'success'
                ? 'bg-green-500/10 text-green-300 border-green-500/20'
                : 'bg-red-500/10 text-red-300 border-red-500/20'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="mt-4 space-y-3">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : filtered.length ? (
            filtered.map((r) => (
              <div key={r.id} className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                  <div>
                    <div className="text-white font-extrabold text-sm">{r.student}</div>
                    <div className="text-theme-muted text-xs mt-1">{r.roll_no} • {r.course} • {r.quiz}</div>
                    <div className="text-theme-muted text-xs mt-2">Out of: {r.out_of}</div>
                  </div>
                  <div className="flex items-end gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Marks</label>
                      <input
                        type="number"
                        value={r.marks}
                        onChange={(e) => setMarks(r.id, e.target.value)}
                        className="w-28 bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-theme-muted text-sm">No records found.</div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-end">
          <button
            type="button"
            onClick={save}
            className="px-5 py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-extrabold uppercase tracking-wider border border-theme-primary/30 shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Updates
          </button>
        </div>
      </div>
    </div>
  );
}

