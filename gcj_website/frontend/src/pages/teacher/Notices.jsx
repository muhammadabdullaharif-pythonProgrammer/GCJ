import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send } from 'lucide-react';

function SkeletonRow() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-3xl h-18" />;
}

export default function Notices() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 650));
      if (!mounted) return;
      setHistory([
        { id: 1, title: 'Lab schedule update', content: 'Physics lab will be moved to Wednesday due to equipment check.', created_at: '2026-06-13' },
        { id: 2, title: 'Assignment submission reminder', content: 'Submit your assignment files before Friday 3pm.', created_at: '2026-06-15' },
      ]);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const post = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!title.trim() || !content.trim()) {
      setFeedback({ type: 'error', message: 'Title and content are required.' });
      return;
    }

    await new Promise((r) => setTimeout(r, 500));

    const next = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      created_at: new Date().toISOString().slice(0, 10),
    };

    setHistory((prev) => [next, ...prev]);
    setTitle('');
    setContent('');
    setFeedback({ type: 'success', message: 'Notice posted to students (demo).' });
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
            <Bell className="w-5 h-5 text-brand-gold" /> Teacher Notices
          </h2>
          <p className="text-theme-muted text-sm">Post notices to students.</p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <h3 className="text-white font-extrabold">Compose Notice</h3>

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

            <form onSubmit={post} className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Content</label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-extrabold uppercase tracking-wider border border-theme-primary/30 shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Post
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-7">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
              <div>
                <h3 className="text-white font-extrabold">History</h3>
                <div className="text-theme-muted text-sm mt-1">Your posted notices.</div>
              </div>
              <div className="text-theme-muted text-xs font-extrabold uppercase tracking-wider">Total: {history.length}</div>
            </div>

            <div className="mt-4 space-y-3">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : history.length ? (
                history.map((n) => (
                  <div key={n.id} className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-white font-extrabold text-sm">{n.title}</div>
                        <div className="text-theme-muted text-xs mt-1">{n.created_at}</div>
                        <div className="text-theme-muted text-sm mt-2 leading-relaxed">{n.content}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-theme-muted text-sm">No notices yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

