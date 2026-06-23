import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, LogOut, GraduationCap } from 'lucide-react';
import Sidebar from './Sidebar';

function getSession() {
  try {
    const raw = localStorage.getItem('gcj_session');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function DashboardLayout({ role, children }) {
  const session = useMemo(() => getSession(), []);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const doLogout = () => {
    localStorage.removeItem('gcj_session');
    localStorage.removeItem('gcj_token');
    window.location.href = '/portal/login';
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      <div className="flex w-full">
        <div className="hidden xl:block">
          <Sidebar role={role} open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
        </div>

        <div className="xl:hidden fixed left-4 top-4 z-50">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-3 rounded-2xl bg-theme-primary-light/20 border border-theme-border/60 text-theme-text shadow-md cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="xl:hidden fixed inset-0 z-40"
            >
              <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
              <div className="relative h-full">
                <Sidebar role={role} open={true} onToggle={() => setSidebarOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-theme-bg/40 backdrop-blur-md border-b border-theme-border/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-theme-primary to-brand-gold flex items-center justify-center shadow-lg shadow-theme-primary/20 flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-extrabold leading-tight truncate">GCJ Portal</div>
                    <div className="text-theme-muted text-xs font-extrabold uppercase tracking-wider truncate">
                      Role: {role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:block text-theme-muted text-xs font-extrabold uppercase tracking-wider">
                    {session?.user?.name || session?.user?.email || 'Welcome'}
                  </div>
                  <button
                    type="button"
                    onClick={doLogout}
                    className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 text-red-200 cursor-pointer inline-flex items-center justify-center"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

