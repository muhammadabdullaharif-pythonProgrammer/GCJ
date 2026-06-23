import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, Edit2, UserPlus, GraduationCap } from 'lucide-react';

function SkeletonRow() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-3xl h-18" />;
}

export default function Teachers() {
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [query, setQuery] = useState('');

  const [form, setForm] = useState({ id: null, name: '', email: '', department: 'CS & IT', designation: 'Professor' });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 700));
      if (!mounted) return;

      setTeachers([
        { id: 1, name: 'Dr. Sajid Mahmood', email: 'sajid.mahmood@gcj.edu.pk', department: 'CS & IT', designation: 'Professor & HOD' },
        { id: 2, name: 'Prof. Muhammad Akram', email: 'm.akram@gcj.edu.pk', department: 'Chemistry', designation: 'Professor & HOD' },
        { id: 3, name: 'Dr. Yasmin Ara', email: 'yasmin.ara@gcj.edu.pk', department: 'Physics', designation: 'Associate Professor & HOD' },
        { id: 4, name: 'Prof. Tariq Javed', email: 'tariq.javed@gcj.edu.pk', department: 'English Literature', designation: 'Professor & HOD' },
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
    if (!q) return teachers;
    return teachers.filter((t) => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.department.toLowerCase().includes(q));
  }, [teachers, query]);

  const resetForm = () => setForm({ id: null, name: '', email: '', department: 'CS & IT', designation: 'Professor' });

  const startEdit = (t) => setForm({ ...t });

  const save = async (e) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 500));

    if (!form.name.trim() || !form.email.trim()) return;

    if (form.id) {
      setTeachers((prev) => prev.map((x) => (x.id === form.id ? { ...form } : x)));
    } else {
      setTeachers((prev) => [{ ...form, id: Date.now() }, ...prev]);
    }

    resetForm();
  };

  const del = (id) => setTeachers((prev) => prev.filter((x) => x.id !== id));

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
            <GraduationCap className="w-5 h-5 text-brand-gold" /> Teacher Management
          </h2>
          <p className="text-theme-muted text-sm">Manage teachers (demo CRUD).</p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 flex-col sm:flex-row">
              <div>
                <h3 className="text-white font-extrabold">{form.id ? 'Edit Teacher' : 'Add Teacher'}</h3>
                <div className="text-theme-muted text-sm mt-1">Update records quickly.</div>
              </div>
              <button
                type="button"
                onClick={resetForm}
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
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Department</label>
                <input
                  value={form.department}
                  onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">Designation</label>
                <input
                  value={form.designation}
                  onChange={(e) => setForm((p) => ({ ...p, designation: e.target.value }))}
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-extrabold uppercase tracking-wider border border-theme-primary/30 shadow-md cursor-pointer"
              >
                {form.id ? 'Update Teacher' : 'Add Teacher'}
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
              <div>
                <h3 className="text-white font-extrabold">Teacher Records</h3>
                <div className="text-theme-muted text-sm mt-1">Search and manage.</div>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name/email/department"
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
                filtered.map((t) => (
                  <div key={t.id} className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                    <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                      <div>
                        <div className="text-white font-extrabold text-sm">{t.name}</div>
                        <div className="text-theme-muted text-xs mt-1">{t.designation}</div>
                        <div className="text-theme-muted text-xs mt-2">{t.department}</div>
                        <div className="text-theme-muted text-xs mt-2">{t.email}</div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(t)}
                          className="px-3 py-2 rounded-xl bg-theme-primary-light/10 hover:bg-theme-primary-light/20 border border-theme-border/60 text-theme-text text-xs font-extrabold uppercase tracking-wider cursor-pointer inline-flex items-center justify-center gap-2"
                        >
                          <Edit2 className="w-4 h-4 text-brand-gold" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => del(t.id)}
                          className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-200 text-xs font-extrabold uppercase tracking-wider cursor-pointer inline-flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-theme-muted text-sm">No teacher records match your search.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

