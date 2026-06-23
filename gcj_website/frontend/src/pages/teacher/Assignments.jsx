import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Trash2, Search } from 'lucide-react';

function SkeletonRow() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-3xl h-18" />;
}

export default function Assignments() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 650));
      if (!mounted) return;

      setItems([
        { id: 1, course: 'BS-CS', title: 'Assignment 1: DSA basics', due: '2026-06-25', description: 'Implement stack and queue operations.' },
        { id: 2, course: 'BS-IT', title: 'Assignment 2: DB normal forms', due: '2026-07-10', description: 'Normalize given schema and justify.' },
        { id: 3, course: 'BS-CS', title: 'Assignment 3: OS scheduling', due: '2026-07-22', description: 'Compare FCFS and SJF scheduling.' },
      ]);

      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = items.filter((i) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return i.title.toLowerCase().includes(q) || i.course.toLowerCase().includes(q);
  });

  const upload = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    await new Promise((r) => setTimeout(r, 500));

    const next = {
      id: Date.now(),
      course: 'BS-CS',
      title: title.trim(),
      due: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
      description: description.trim(),
    };

    setItems((prev) => [next, ...prev]);
    setTitle('');
    setDescription('');
  };

  const del = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6"
      >
        <div className="space-y-2">
          <h2 className="text-white font-extrabold text-xl">Assignments</h2>
          <p className="text-theme-muted text-sm">Upload + manage assignments (demo).</p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <h3 className="text-white font-extrabold">Upload Assignment</h3>

            <form className="mt-4 space-y-4" onSubmit={upload}>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Description</label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-extrabold uppercase tracking-wider border border-theme-primary/30 shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-7">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
              <div>
                <h3 className="text-white font-extrabold">Assignment List</h3>
                <div className="text-theme-muted text-sm mt-1">Search, view and delete (demo).</div>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by course or title"
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
                filtered.map((a) => (
                  <div key={a.id} className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-white font-extrabold text-sm flex items-center gap-2">
                          <FileText className="w-4 h-4 text-brand-gold" /> {a.title}
                        </div>
                        <div className="text-theme-muted text-xs mt-1">Course: {a.course}</div>
                        <div className="text-theme-muted text-xs mt-2">Due: {a.due}</div>
                        <div className="text-theme-muted text-sm mt-2 leading-relaxed">{a.description}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => del(a.id)}
                        className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 cursor-pointer"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-200" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-theme-muted text-sm">No assignments found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

