import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Search, Filter, Loader2 } from 'lucide-react';
import AdminSettingsGroups from '../../components/AdminSettingsGroups';
import { api } from '../../utils/api';

function SkeletonPanel() {
  return (
    <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
      <div className="animate-pulse bg-theme-primary-light/30 rounded-xl h-8 w-2/3" />
      <div className="mt-4 animate-pulse bg-theme-primary-light/30 rounded-xl h-10 w-full" />
      <div className="mt-3 animate-pulse bg-theme-primary-light/30 rounded-xl h-10 w-full" />
    </div>
  );
}

export default function Students() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('All');
  const [feedback, setFeedback] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [adminBusy, setAdminBusy] = useState(false);

  const reload = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      // Student admin endpoints may not exist in backend yet.
      // We will use optional chaining: if api.getStudentsAdmin exists, use it; else fallback to mock via Students admin UI.
      if (api.getStudentsAdmin) {
        const list = await api.getStudentsAdmin();
        setStudents(Array.isArray(list) ? list : []);
      } else {
        // fallback: reuse current mock from Students page (old behavior) by deriving a small set
        // (keeps UI functional even if backend endpoints are not ready yet)
        setStudents([
          { id: 1, name: 'M. Ali', roll_no: 'GCJ-31011', department: 'CS & IT', email: 'm.ali@gcj.edu.pk', phone: '+92 300 1111111' },
          { id: 2, name: 'Ayesha Sohail', roll_no: 'GCJ-31012', department: 'Chemistry', email: 'ayesha.s@gcj.edu.pk', phone: '+92 300 2222222' },
          { id: 3, name: 'Usman Khan', roll_no: 'GCJ-31013', department: 'Physics', email: 'usman.k@gcj.edu.pk', phone: '+92 300 3333333' },
          { id: 4, name: 'Sara Raza', roll_no: 'GCJ-31014', department: 'Math', email: 'sara.r@gcj.edu.pk', phone: '+92 300 4444444' },
        ]);
      }

      // departments filter
      const depts = api.getDepartments ? await api.getDepartments() : [];
      // normalize departments names
      setDepartments(Array.isArray(depts) ? depts.map((d) => d.name) : []);
    } catch (e) {
      setFeedback({ type: 'error', message: e?.message || 'Failed to load students.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      const matchQ =
        !q ||
        String(s.name || '').toLowerCase().includes(q) ||
        String(s.roll_no || '').toLowerCase().includes(q) ||
        String(s.email || '').toLowerCase().includes(q);
      const matchDept = dept === 'All' || String(s.department || '') === dept;
      return matchQ && matchDept;
    });
  }, [students, query, dept]);

  const groups = useMemo(
    () => [
      {
        key: 'students',
        title: 'Student Records',
        subtitle: 'Add / edit / delete students (dynamic UI).',
        defaultOpen: true,
        addButtonLabel: 'New Student',
        items: filtered,
        itemTitle: (it) => it?.name || it?.roll_no || `#${it?.id}`,
        itemSubtitle: (it) => `${it?.roll_no || ''} • ${it?.department || ''}`.trim(),
        previewFields: ['roll_no', 'department', 'email', 'phone'],
      },
    ],
    [filtered]
  );

  const itemFormFields = useMemo(
    () => ({
      name: { label: 'Name', required: true, type: 'text' },
      roll_no: { label: 'Roll No', required: true, type: 'text' },
      department: {
        label: 'Department',
        required: true,
        type: 'text',
        // keep simple: user can type department name.
        placeholder: 'e.g. Computer Science & IT',
      },
      email: { label: 'Email', required: false, type: 'text' },
      phone: { label: 'Phone', required: false, type: 'text' },
    }),
    []
  );

  const onCreate = async (_groupKey, payload) => {
    setAdminBusy(true);
    try {
      if (api.createStudentAdmin) {
        await api.createStudentAdmin(payload);
      } else {
        // local fallback
        const newItem = { ...payload, id: Date.now() };
        setStudents((prev) => [newItem, ...prev]);
      }
      await reload();
    } finally {
      setAdminBusy(false);
    }
  };

  const onUpdate = async (_groupKey, itemId, payload) => {
    setAdminBusy(true);
    try {
      if (api.updateStudentAdmin) {
        await api.updateStudentAdmin(itemId, payload);
      } else {
        setStudents((prev) => prev.map((x) => (x.id === itemId ? { ...x, ...payload } : x)));
      }
      await reload();
    } finally {
      setAdminBusy(false);
    }
  };

  const onDelete = async (_groupKey, itemId) => {
    setAdminBusy(true);
    try {
      if (api.deleteStudentAdmin) {
        await api.deleteStudentAdmin(itemId);
      } else {
        setStudents((prev) => prev.filter((x) => x.id !== itemId));
      }
      await reload();
    } finally {
      setAdminBusy(false);
    }
  };

  const departmentOptions = useMemo(() => {
    const unique = new Set(departments);
    for (const s of students) unique.add(s.department);
    return ['All', ...Array.from(unique).filter(Boolean)];
  }, [departments, students]);

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
            <GraduationCap className="w-5 h-5 text-brand-gold" /> Student Management
          </h2>
          <p className="text-theme-muted text-sm">Dynamic grouped cards with +/- expand/collapse.</p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 space-y-4">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-white font-extrabold text-sm">Filters</div>
                <div className="text-theme-muted text-xs mt-1">Search + department filter.</div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name/roll/email"
                  className="w-full pl-10 bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-brand-gold" />
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold cursor-pointer w-full"
                >
                  {departmentOptions.map((d) => (
                    <option key={d} value={d} className="bg-theme-footer">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {feedback ? (
                <div className="p-3 rounded-xl border text-xs bg-red-500/10 text-red-200 border-red-500/20">
                  {feedback.message}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 space-y-4">
          {loading ? (
            <SkeletonPanel />
          ) : (
            <AdminSettingsGroups
              groups={groups}
              itemFormFields={itemFormFields}
              loading={adminBusy || loading}
              error={feedback?.type === 'error' ? feedback.message : null}
              onCreate={onCreate}
              onUpdate={onUpdate}
              onDelete={onDelete}
              canEdit
            />
          )}

          {adminBusy ? (
            <div className="flex items-center gap-2 text-theme-muted text-xs font-extrabold">
              <Loader2 className="w-4 h-4 animate-spin" /> Working...
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

