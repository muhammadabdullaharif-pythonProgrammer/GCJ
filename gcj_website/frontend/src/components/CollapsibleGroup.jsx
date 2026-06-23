import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CollapsibleGroup({
  title,
  subtitle,
  defaultOpen = false,
  right,
  children,
  className = '',
  headerClassName = '',
}) {
  const [open, setOpen] = useState(defaultOpen);

  const chevronClass = useMemo(() => (open ? 'text-brand-gold' : 'text-theme-muted'), [open]);
  const Icon = open ? ChevronUp : ChevronDown;


  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full text-left glass border border-theme-border/60 rounded-3xl px-4 sm:px-5 py-3 sm:py-4 transition-colors cursor-pointer ${headerClassName}`}
        aria-expanded={open}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className={`w-5 h-5 flex items-center justify-center font-extrabold ${chevronClass}`} aria-hidden>
                {open ? '-' : '+'}
              </span>

              <div className="text-white font-extrabold truncate">{title}</div>
            </div>
            {subtitle ? <div className="text-theme-muted text-sm mt-1">{subtitle}</div> : null}
          </div>

          {right ? <div className="flex items-center gap-2">{right}</div> : null}
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="overflow-hidden"
      >
        <div className="pt-3">{children}</div>
      </motion.div>
    </div>
  );
}

