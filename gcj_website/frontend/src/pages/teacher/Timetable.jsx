import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';

function SkeletonRow() {
  return <div className="animate-pulse bg-theme-primary-light/30 rounded-3xl h-14" />;
}

export default function Timetable() {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 650));
      if (!mounted) return;

      setSchedule([
        { day: 'Monday', items: [
          { time: '9:00 - 10:00', cls: 'BS-CS • DSA', room: 'Lab-1' },
          { time: '10:15 - 11:15', cls: 'BS-IT • DB', room: 'Lab-2' },
        ] },
        { day: 'Wednesday', items: [
          { time: '9:00 - 10:00', cls: 'BS-CS • OS', room: 'Lab-1' },
          { time: '10:15 - 11:15', cls: 'BS-IT • Web Dev', room: 'Lab-2' },
        ] },
        { day: 'Friday', items: [
          { time: '9:00 - 10:00', cls: 'BS-CS • Math', room: 'Room-204' },
          { time: '10:15 - 11:15', cls: 'BS-IT • Networking', room: 'Room-305' },
        ] },
      ]);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

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
            <CalendarDays className="w-5 h-5 text-brand-gold" /> Timetable
          </h2>
          <p className="text-theme-muted text-sm">View class schedule.</p>
        </div>
      </motion.section>

      <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
        {loading ? (
          <div className="space-y-3">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : schedule.length ? (
          <div className="space-y-4">
            {schedule.map((d) => (
              <div key={d.day} className="bg-theme-primary-light/10 border border-theme-border/60 rounded-3xl p-4">
                <div className="text-white font-extrabold">{d.day}</div>
                <div className="mt-3 space-y-3">
                  {d.items.map((it, idx) => (
                    <div key={idx} className="bg-theme-primary-light/10 border border-theme-border/60 rounded-2xl p-3">
                      <div className="text-white font-extrabold text-xs uppercase tracking-wider">{it.time}</div>
                      <div className="text-theme-muted text-sm mt-2">{it.cls}</div>
                      <div className="text-theme-muted text-xs mt-1">Room: {it.room}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-theme-muted text-sm">No schedule available.</div>
        )}
      </div>
    </div>
  );
}

