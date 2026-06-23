import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send } from 'lucide-react';

function SkeletonRow() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-2xl h-16" />;
}

export default function Notices() {
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState('All');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 650));
      if (!mounted) return;

      setNotices([
        { id: 1, title: 'Summer vacations announced', target: 'All', created_at: '2026-06-08', content: 'Summer vacations from June 15 to Aug 14.' },
        { id: 2, title: 'Fee submission reminder', target: 'Student', created_at: '2026-06-05', content: 'Submit examination fee challans by June 22.' },
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

    setNotices((prev) => [
      { id: Date.now(), title: title.trim(), content: content.trim(), target, created_at: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);

    setTitle('');
    setContent('');
    setTarget('All');
    setFeedback({ type: 'success', message: 'Notice posted to all roles (demo).' });
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
          <h2 className="text-white font-extrabold text-xl">Admin Notices</h2>
          <p className="text-theme-muted text-sm">Post notices to all roles.</p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
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
                <div className="font-extrabold uppercase tracking-widest">{feedback.type}</div>
                <div className="mt-1 opacity-90">{feedback.message}</div>
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
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Target Role</label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold cursor-pointer"
                >
                  {['All', 'Student', 'Teacher', 'Admin'].map((t) => (
                    <option key={t} value={t} className="bg-theme-footer">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Content</label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-extrabold uppercase tracking-wider border border-theme-primary shadow-lg shadow-theme-primary/20 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Post Notice
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
              <h3 className="text-white font-extrabold">Notice History</h3>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-theme-primary-light/15 border border-theme-border/60 text-theme-muted text-xs">
                <Bell className="w-4 h-4 text-brand-gold" />
                <span className="font-extrabold">Total: {notices.length}</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : notices.length ? (
                notices.map((n) => (
                  <div key={n.id} className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-white font-extrabold text-sm">{n.title}</div>
                        <div className="text-theme-muted text-xs mt-1">
                          Target: <span className="font-extrabold text-theme-text">{n.target}</span>
                        </div>
                        <div className="text-theme-muted text-xs mt-2 leading-relaxed">{n.content}</div>
                      </div>
                      <div className="text-[11px] text-theme-muted font-extrabold">{n.created_at}</div>
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

