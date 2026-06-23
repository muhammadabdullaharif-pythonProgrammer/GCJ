import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

function SkeletonCard() {
  return (
    <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
      <div className="animate-pulse bg-theme-primary-light/30 rounded-xl h-8 w-2/3" />
      <div className="mt-4 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse bg-theme-primary-light/30 rounded-xl h-10" />
        ))}
      </div>
    </div>
  );
}

export default function Results() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 650));
      if (!mounted) return;

      setData([
        {
          semester: 'Semester 1',
          cgpa: 2.98,
          status: 'Passed',
          subjects: [
            { name: 'CS Fundamentals', grade: 'B+', marks: 74 },
            { name: 'Mathematics I', grade: 'B', marks: 71 },
            { name: 'Communication Skills', grade: 'A-', marks: 82 },
          ],
        },
        {
          semester: 'Semester 2',
          cgpa: 3.21,
          status: 'Passed',
          subjects: [
            { name: 'Programming', grade: 'A-', marks: 84 },
            { name: 'Physics Basics', grade: 'B+', marks: 76 },
            { name: 'Database Concepts', grade: 'A', marks: 88 },
          ],
        },
        {
          semester: 'Semester 3',
          cgpa: 3.42,
          status: 'Improving',
          subjects: [
            { name: 'Data Structures', grade: 'A', marks: 90 },
            { name: 'Statistics', grade: 'B+', marks: 78 },
            { name: 'Operating Systems (Intro)', grade: 'A-', marks: 86 },
          ],
        },
      ]);

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
          <div className="space-y-2">
            <h2 className="text-white font-extrabold text-xl">Results</h2>
            <p className="text-theme-muted text-sm">Semester-wise result cards with CGPA highlights.</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-theme-primary-light/15 border border-theme-border/60 text-theme-muted text-xs font-extrabold uppercase tracking-wider">
            <FileText className="w-4 h-4 text-brand-gold" />
            History
          </div>
        </div>
      </motion.section>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {data.map((sem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: idx * 0.03 }}
              className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6"
            >
              <div>
                <div className="text-theme-light text-[11px] uppercase tracking-wider font-extrabold">{sem.semester}</div>
                <h3 className="text-white font-extrabold text-lg mt-1">CGPA: {sem.cgpa.toFixed(2)}</h3>
                <div className="mt-2 px-3 py-1.5 rounded-full inline-flex items-center gap-2 border border-theme-border/60 bg-theme-primary-light/10">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      sem.status === 'Passed' ? 'bg-green-400' : 'bg-brand-gold'
                    }`}
                  />
                  <span className="font-extrabold text-theme-muted">{sem.status}</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {sem.subjects.map((s, j) => (
                  <div key={j} className="flex items-center justify-between gap-3 bg-theme-primary-light/10 border border-theme-border/60 rounded-2xl p-3">
                    <div>
                      <div className="text-white font-extrabold text-xs">{s.name}</div>
                      <div className="text-theme-muted text-[11px]">Marks: {s.marks}</div>
                    </div>
                    <div className="text-brand-gold font-extrabold text-xs">{s.grade}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

