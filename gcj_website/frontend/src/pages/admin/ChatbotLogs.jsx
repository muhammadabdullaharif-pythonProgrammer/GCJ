import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search } from 'lucide-react';

function SkeletonRow() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-2xl h-16" />;
}

export default function ChatbotLogs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 650));
      if (!mounted) return;
      setLogs([
        { id: 1, user: 'GCJ-20001', query: 'What are eligibility criteria for BS CS?', response: 'Minimum 50% in ICS/F.Sc with Mathematics...', ts: '2026-06-12 10:24' },
        { id: 2, user: 'GCJ-20002', query: 'Fee range for BS programs?', response: 'Approx 25k-35k PKR per semester depending on program...', ts: '2026-06-13 13:02' },
        { id: 3, user: 'Anonymous', query: 'How to apply?', response: 'Use Admissions portal, submit details, and compute merit...', ts: '2026-06-14 09:10' },
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
    if (!q) return logs;
    return logs.filter((l) => l.query.toLowerCase().includes(q) || l.response.toLowerCase().includes(q) || l.user.toLowerCase().includes(q));
  }, [logs, query]);

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6"
      >
        <div className="space-y-2">
          <h2 className="text-white font-extrabold text-xl">Chatbot Logs</h2>
          <p className="text-theme-muted text-sm">View all chatbot conversation history (demo).</p>
        </div>
      </motion.section>

      <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
          <h3 className="text-white font-extrabold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-gold" /> Conversation Records
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in logs"
              className="w-full pl-10 bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
            />
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
            filtered.map((l) => (
              <div key={l.id} className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white font-extrabold text-sm">{l.user}</div>
                    <div className="text-theme-muted text-xs mt-1">{l.ts}</div>

                    <div className="mt-3">
                      <div className="text-[11px] uppercase tracking-widest font-extrabold text-theme-light">Query</div>
                      <div className="text-theme-text text-sm mt-1">{l.query}</div>
                    </div>

                    <div className="mt-3">
                      <div className="text-[11px] uppercase tracking-widest font-extrabold text-theme-light">Response</div>
                      <div className="text-theme-muted text-sm mt-1 leading-relaxed">{l.response}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-theme-muted text-sm">No logs match your search.</div>
          )}
        </div>
      </div>
    </div>
  );
}

