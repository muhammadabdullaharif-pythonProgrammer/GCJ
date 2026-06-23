import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, BadgeCheck, TrendingDown } from 'lucide-react';

function SkeletonRow() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-3xl h-20" />;
}

function StatusPill({ variant, label }) {
  const cls =
    variant === 'paid'
      ? 'bg-green-500/10 text-green-300 border-green-500/20'
      : variant === 'due'
      ? 'bg-red-500/10 text-red-300 border-red-500/20'
      : 'bg-brand-gold/10 text-brand-gold border-brand-gold/20';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${cls}`}>
      {variant === 'paid' ? <BadgeCheck className="w-4 h-4" /> : variant === 'due' ? <TrendingDown className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
      {label}
    </div>
  );
}

export default function FeeStatus() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 650));
      if (!mounted) return;

      setHistory([
        { id: 1, semester: 'Spring 2026', type: 'Tuition Fee', amount: 32000, status: 'Paid', due_date: '2026-02-28', paid_date: '2026-02-20' },
        { id: 2, semester: 'Spring 2026', type: 'Exam Fee', amount: 3500, status: 'Paid', due_date: '2026-06-22', paid_date: '2026-06-12' },
        { id: 3, semester: 'Fall 2026', type: 'Tuition Fee', amount: 33000, status: 'Due', due_date: '2026-09-20', paid_date: null },
      ]);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const totals = useMemo(() => {
    const paid = history.filter((h) => h.status === 'Paid').reduce((a, b) => a + b.amount, 0);
    const due = history.filter((h) => h.status === 'Due').reduce((a, b) => a + b.amount, 0);
    return { paid, due };
  }, [history]);

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
              <Receipt className="w-5 h-5 text-brand-gold" /> Fee Status
            </h2>
            <p className="text-theme-muted text-sm">Payment history and current status.</p>
          </div>

          <div className="flex gap-3">
            <div className="px-3 py-2 rounded-2xl bg-theme-primary-light/15 border border-theme-border/60">
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Paid Total</div>
              <div className="text-white font-extrabold text-sm mt-1">{totals.paid ? totals.paid.toLocaleString() : '—'} PKR</div>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-theme-primary-light/15 border border-theme-border/60">
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Due Total</div>
              <div className="text-white font-extrabold text-sm mt-1">{totals.due ? totals.due.toLocaleString() : '—'} PKR</div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
        {loading ? (
          <div className="space-y-3">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : history.length ? (
          <div className="space-y-3">
            {history.map((h) => (
              <div key={h.id} className="flex items-start justify-between gap-4 bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                <div>
                  <div className="text-white font-extrabold text-sm">{h.type}</div>
                  <div className="text-theme-muted text-xs mt-1">{h.semester} • Due: {h.due_date}</div>
                  {h.status === 'Paid' && (
                    <div className="text-theme-muted text-xs mt-2">Paid on: {h.paid_date}</div>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-col sm:flex-row">
                  <div className="text-white font-extrabold text-sm">{h.amount.toLocaleString()} PKR</div>
                  <StatusPill
                    variant={h.status === 'Paid' ? 'paid' : 'due'}
                    label={h.status}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-theme-muted text-sm">No fee records found.</div>
        )}
      </div>
    </div>
  );
}

