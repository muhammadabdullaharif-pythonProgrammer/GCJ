import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Filter } from 'lucide-react';
import { api } from '../../utils/api';

function SkeletonRow() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-3xl h-20" />;
}

export default function Notices() {
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await api.getNotices('Student');
        if (!mounted) return;
        setNotices(data);
      } catch {
        if (!mounted) return;
        setNotices([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'All') return notices;
    return notices.filter((n) => n.title.toLowerCase().includes(filter.toLowerCase()));
  }, [notices, filter]);

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
              <Bell className="w-5 h-5 text-brand-gold" /> Notices
            </h2>
            <p className="text-theme-muted text-sm">Notice board for students.</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-theme-primary-light/15 border border-theme-border/60 text-theme-muted text-xs font-extrabold uppercase tracking-wider">
            <Filter className="w-4 h-4 text-brand-gold" /> Role: Student
          </div>
        </div>
      </motion.section>

      <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
          <div>
            <div className="text-white font-extrabold">Student Notices</div>
            <div className="text-theme-muted text-sm mt-1">Loading skeletons shown while fetching data.</div>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold cursor-pointer"
          >
            <option value="All" className="bg-theme-footer">All</option>
            <option value="fee" className="bg-theme-footer">Fee</option>
            <option value="vacation" className="bg-theme-footer">Vacations</option>
            <option value="laptop" className="bg-theme-footer">Laptop Scheme</option>
          </select>
        </div>

        <div className="mt-4 space-y-3">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : filtered.length ? (
            filtered.map((n) => (
              <div key={n.id} className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white font-extrabold text-sm">{n.title}</div>
                    <div className="text-theme-muted text-xs mt-1">{n.created_at}</div>
                    <div className="text-theme-muted text-sm mt-2 leading-relaxed">{n.content}</div>
                  </div>
                  <div className="text-[11px] text-theme-muted font-extrabold">{n.target_role || 'Student'}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-theme-muted text-sm">No notices found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

