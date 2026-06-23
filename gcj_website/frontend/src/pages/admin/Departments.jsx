import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, Edit2, UserPlus, Building2 } from 'lucide-react';

function SkeletonRow() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-3xl h-18" />;
}

export default function Departments() {
  const [loading, setLoading] = useState(true);
  const [depts, setDepts] = useState([]);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ id: null, name: '', hod: '', total_seats: '' });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 700));
      if (!mounted) return;

      setDepts([
        { id: 1, name: 'Computer Science & IT', hod: 'Dr. Sajid Mahmood', total_seats: 120 },
        { id: 2, name: 'Chemistry', hod: 'Prof. Muhammad Akram', total_seats: 80 },
        { id: 3, name: 'Physics', hod: 'Dr. Yasmin Ara', total_seats: 75 },
        { id: 4, name: 'English Literature', hod: 'Prof. Tariq Javed', total_seats: 90 },
        { id: 5, name: 'Mathematics', hod: 'Prof. Shaban Ali', total_seats: 80 },
        { id: 6, name: 'Commerce & Business Administration', hod: 'Dr. Muhammad Rizwan', total_seats: 100 },
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
    if (!q) return depts;
    return depts.filter((d) => d.name.toLowerCase().includes(q) || d.hod.toLowerCase().includes(q));
  }, [depts, query]);

  const reset = () => setForm({ id: null, name: '', hod: '', total_seats: '' });

  const startEdit = (d) => setForm({ id: d.id, name: d.name, hod: d.hod, total_seats: d.total_seats });

  const save = async (e) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 500));

    if (!form.name.trim()) return;

    if (form.id) {
      setDepts((prev) => prev.map((x) => (x.id === form.id ? { ...form, total_seats: Number(form.total_seats) || x.total_seats } : x)));
    } else {
      setDepts((prev) => [{ id: Date.now(), name: form.name.trim(), hod: form.hod.trim(), total_seats: Number(form.total_seats) || 0 }, ...prev]);
    }

    reset();
  };

  const del = (id) => setDepts((prev) => prev.filter((x) => x.id !== id));

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
            <Building2 className="w-5 h-5 text-brand-gold" /> Department Management
          </h2>
          <p className="text-theme-muted text-sm">Department CRUD (demo).</p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 flex-col sm:flex-row">
              <div>
                <h3 className="text-white font-extrabold">{form.id ? 'Edit Department' : 'Add Department'}</h3>
                <div className="text-theme-muted text-sm mt-1">Create or update departments.</div>
              </div>
              <button
                type="button"
                onClick={reset}
                className="px-3 py-2 rounded-xl bg-theme-primary-light/10 hover:bg-theme-primary-light/20 border border-theme-border/60 text-theme-text text-xs font-extrabold uppercase tracking-wider cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-brand-gold" /> New
              </button>
            </div>

            <form onSubmit={save} className="mt-4 space-y-3">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">HOD</label>
                <input
                  value={form.hod}
                  onChange={(e) => setForm((p) => ({ ...p, hod: e.target.value }))}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Total Seats</label>
                <input
                  type="number"
                  value={form.total_seats}
                  onChange={(e) => setForm((p) => ({ ...p, total_seats: e.target.value }))}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-extrabold uppercase tracking-wider border border-theme-primary/30 shadow-md cursor-pointer"
              >
                {form.id ? 'Update Department' : 'Add Department'}
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
              <div>
                <h3 className="text-white font-extrabold">Department Records</h3>
                <div className="text-theme-muted text-sm mt-1">Search and manage.</div>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by department or HOD"
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
                filtered.map((d) => (
                  <div key={d.id} className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                    <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                      <div>
                        <div className="text-white font-extrabold text-sm">{d.name}</div>
                        <div className="text-theme-muted text-xs mt-1">HOD: {d.hod}</div>
                        <div className="text-theme-muted text-xs mt-2">Seats: {d.total_seats}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(d)}
                          className="px-3 py-2 rounded-xl bg-theme-primary-light/10 hover:bg-theme-primary-light/20 border border-theme-border/60 text-theme-text text-xs font-extrabold uppercase tracking-wider cursor-pointer inline-flex items-center justify-center gap-2"
                        >
                          <Edit2 className="w-4 h-4 text-brand-gold" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => del(d.id)}
                          className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-200 text-xs font-extrabold uppercase tracking-wider cursor-pointer inline-flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-theme-muted text-sm">No departments match your search.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

