import React, { useEffect, useMemo, useState } from 'react';
import CollapsibleGroup from './CollapsibleGroup';
import { motion } from 'framer-motion';
import { Plus, PencilLine, Trash2, Loader2, AlertTriangle } from 'lucide-react';

function CardShell({ children }) {
  return <div className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4 sm:p-5">{children}</div>;
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] uppercase tracking-widest font-extrabold text-theme-light">{label}</div>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = 'text', placeholder = '', disabled = false }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold disabled:opacity-50"
    />
  );
}

function Select({ value, onChange, options, disabled = false }) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full bg-theme-primary-light/10 border border-theme-border/60 rounded-xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold cursor-pointer disabled:opacity-50"
    >
      {options.map((opt) => (
        <option key={String(opt.value)} value={opt.value} className="bg-theme-footer">
          {opt.label}
        </option>
      ))}
    </select>
  );
}

/**
 * groups: [
 *   {
 *     key,
 *     title,
 *     subtitle?,
 *     defaultOpen?,
 *     addButtonLabel?,
 *     items: [ { id, ...fields } ]  // injected by parent via loader
 *   }
 * ]
 *
 * itemFormFields: { [fieldKey]: { label, type, required?, options? } }
 */
export default function AdminSettingsGroups({
  groups = [],
  itemFormFields = {},
  onCreate,
  onUpdate,
  onDelete,
  loading = false,
  error = null,
  canEdit = true,
}) {
  const [localOpen, setLocalOpen] = useState(() => {
    const m = {};
    for (const g of groups) m[g.key] = Boolean(g.defaultOpen);
    return m;
  });

  useEffect(() => {
    setLocalOpen(() => {
      const m = {};
      for (const g of groups) m[g.key] = Boolean(g.defaultOpen);
      return m;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups.length]);

  const [activeForm, setActiveForm] = useState(null); // { groupKey, mode: 'create'|'edit', itemId? }
  const [draft, setDraft] = useState({});
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const groupedItems = useMemo(() => {
    const out = new Map();
    for (const g of groups) out.set(g.key, g.items || []);
    return out;
  }, [groups]);

  const startCreate = (groupKey) => {
    const template = {};
    for (const k of Object.keys(itemFormFields)) {
      // keep blank defaults; parent can pre-fill via itemFormFields.defaultValue
      template[k] = itemFormFields[k]?.defaultValue ?? '';
    }
    setDraft(template);
    setActiveForm({ groupKey, mode: 'create', itemId: null });
    setFeedback(null);
  };

  const startEdit = (groupKey, item) => {
    setDraft({ ...item });
    setActiveForm({ groupKey, mode: 'edit', itemId: item.id });
    setFeedback(null);
  };

  const closeForm = () => {
    setActiveForm(null);
    setDraft({});
    setFeedback(null);
  };

  const validate = () => {
    for (const [fieldKey, cfg] of Object.entries(itemFormFields)) {
      if (cfg?.required) {
        const v = draft[fieldKey];
        if (v === undefined || v === null || String(v).trim() === '') return false;
      }
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setFeedback({ type: 'error', message: 'Please fill required fields.' });
      return;
    }
    if (!activeForm) return;

    setBusy(true);
    setFeedback(null);

    try {
      const payload = { ...draft };
      if (activeForm.mode === 'create') {
        await onCreate(activeForm.groupKey, payload);
      } else {
        await onUpdate(activeForm.groupKey, activeForm.itemId, payload);
      }

      closeForm();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Operation failed. Please try again.',
      });
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async (groupKey, itemId) => {
    if (!canEdit) return;
    setBusy(true);
    setFeedback(null);
    try {
      await onDelete(groupKey, itemId);
    } catch (err) {
      setFeedback({ type: 'error', message: err?.message || 'Delete failed.' });
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <div className="glass border border-red-500/20 rounded-3xl p-5">
        <div className="flex items-center gap-2 text-red-200 font-extrabold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          Admin settings error
        </div>
        <div className="text-theme-muted text-xs mt-2">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {loading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-brand-gold animate-spin" />
        </div>
      )}

      {!loading && (
        <>
          {groups.map((group) => {
            const items = groupedItems.get(group.key) || [];

            const isFormOpen = activeForm && activeForm.groupKey === group.key;
            const showInlineForm = Boolean(isFormOpen);

            return (
              <div key={group.key}>
                <CollapsibleGroup
                  title={group.title}
                  subtitle={group.subtitle}
                  defaultOpen={group.defaultOpen}
                  headerClassName="bg-theme-primary-light/8"
                  right={
                    canEdit ? (
                      <button
                        type="button"
                        onClick={() => startCreate(group.key)}
                        className="px-3 py-2 rounded-xl bg-theme-primary-light/10 hover:bg-theme-primary-light/20 border border-theme-border/60 text-theme-text text-xs font-extrabold uppercase tracking-wider cursor-pointer inline-flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4 text-brand-gold" />
                        {group.addButtonLabel || 'New'}
                      </button>
                    ) : null
                  }
                >
                  <div className="space-y-3">
                    {showInlineForm && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="space-y-3"
                      >
                        <CardShell>
                          <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                            <div>
                              <div className="text-white font-extrabold text-sm">
                                {activeForm?.mode === 'edit' ? 'Edit Item' : 'Create New'}
                              </div>
                              <div className="text-theme-muted text-xs mt-1">
                                {activeForm?.mode === 'edit' ? 'Update record details.' : 'Fill details to create record.'}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={closeForm}
                                className="px-3 py-2 rounded-xl bg-theme-primary-light/10 hover:bg-theme-primary-light/20 border border-theme-border/60 text-theme-text text-xs font-extrabold uppercase tracking-wider cursor-pointer inline-flex items-center justify-center"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>

                          {feedback && (
                            <div
                              className={`mt-4 p-3 rounded-xl border text-xs ${
                                feedback.type === 'error'
                                  ? 'bg-red-500/10 text-red-200 border-red-500/20'
                                  : 'bg-green-500/10 text-green-300 border-green-500/20'
                              }`}
                            >
                              {feedback.message}
                            </div>
                          )}

                          <form onSubmit={submit} className="mt-4 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {Object.entries(itemFormFields).map(([fieldKey, cfg]) => {
                                const type = cfg.type || 'text';
                                const required = Boolean(cfg.required);
                                const disabled = busy;

                                if (type === 'select') {
                                  const options = (cfg.options || []).map((o) => ({
                                    label: o.label ?? String(o.value),
                                    value: o.value,
                                  }));

                                  return (
                                    <Field key={fieldKey} label={cfg.label || fieldKey}>
                                      <Select
                                        value={draft[fieldKey] ?? ''}
                                        disabled={disabled}
                                        onChange={(e) => setDraft((p) => ({ ...p, [fieldKey]: e.target.value }))}
                                        options={options}
                                      />
                                      {required ? null : null}
                                    </Field>
                                  );
                                }

                                return (
                                  <Field key={fieldKey} label={cfg.label || fieldKey}>
                                    <Input
                                      type={type}
                                      value={draft[fieldKey] ?? ''}
                                      disabled={disabled || (cfg.readOnlyOnEdit && activeForm?.mode === 'edit')}
                                      placeholder={cfg.placeholder || ''}
                                      onChange={(e) => setDraft((p) => ({ ...p, [fieldKey]: e.target.value }))}
                                    />
                                  </Field>
                                );
                              })}
                            </div>

                            <button
                              type="submit"
                              disabled={busy}
                              className="w-full py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover disabled:bg-theme-primary/60 text-white text-xs font-extrabold uppercase tracking-wider border border-theme-primary/30 shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
                            >
                              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                              {activeForm?.mode === 'edit' ? 'Save Changes' : 'Create'}
                            </button>
                          </form>
                        </CardShell>
                      </motion.div>
                    )}

                    <div className="space-y-3">
                      {items.length ? (
                        items.map((item) => (
                          <CardShell key={String(item.id)}>
                            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                              <div className="min-w-0">
                                <div className="text-white font-extrabold text-sm truncate">
                                  {group.itemTitle ? group.itemTitle(item) : item?.name || item?.roll_no || item?.title || `#${item.id}`}
                                </div>
                                <div className="text-theme-muted text-xs mt-1">
                                  {group.itemSubtitle ? group.itemSubtitle(item) : item?.email || item?.department || item?.status || item?.category || ''}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {canEdit ? (
                                  <button
                                    type="button"
                                    onClick={() => startEdit(group.key, item)}
                                    className="px-3 py-2 rounded-xl bg-theme-primary-light/10 hover:bg-theme-primary-light/20 border border-theme-border/60 text-theme-text text-xs font-extrabold uppercase tracking-wider cursor-pointer inline-flex items-center justify-center gap-2"
                                  >
                                    <PencilLine className="w-4 h-4 text-brand-gold" />
                                    Edit
                                  </button>
                                ) : null}

                                {canEdit ? (
                                  <button
                                    type="button"
                                    onClick={() => doDelete(group.key, item.id)}
                                    className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-200 text-xs font-extrabold uppercase tracking-wider cursor-pointer inline-flex items-center justify-center"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                ) : null}
                              </div>
                            </div>

                            {itemFormFields && Object.keys(itemFormFields).length > 0 && group.previewFields?.length ? (
                              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {group.previewFields.map((fk) => (
                                  <div key={fk} className="text-theme-muted text-[11px]">
                                    <span className="font-extrabold text-theme-light">{itemFormFields[fk]?.label || fk}:</span>{' '}
                                    <span className="text-theme-text">{String(item?.[fk] ?? '')}</span>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </CardShell>
                        ))
                      ) : (
                        <div className="text-theme-muted text-sm">No records yet.</div>
                      )}
                    </div>
                  </div>
                </CollapsibleGroup>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

