import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { api } from '../../utils/api';

function SkeletonBubble() {
  return (
    <div className="flex">
      <div className="animate-pulse bg-theme-primary-light/30 rounded-3xl h-14 w-3/4" />
    </div>
  );
}

export default function AIAdvisor() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function init() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 650));
      if (!mounted) return;

      setMessages([
        {
          id: 1,
          role: 'assistant',
          text: 'Hi! I’m the GCJ Admission Advisor. Ask me about eligibility, courses, fees, faculty, or the application process.',
          ts: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const chatFooter = useMemo(() => {
    return sending ? 'Thinking...' : 'Type your question…';
  }, [sending]);

  const ask = async (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;

    setSending(true);
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: q, ts: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const resp = await api.askAdvisor(q);
      const botMsg = { id: Date.now() + 1, role: 'assistant', text: resp?.response || 'No response available.', ts: new Date().toISOString() };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const botMsg = { id: Date.now() + 1, role: 'assistant', text: 'Network error. Please try again later.', ts: new Date().toISOString() };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
          <div className="space-y-2">
            <h2 className="text-white font-extrabold text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-gold" /> AI Advisor
            </h2>
            <p className="text-theme-muted text-sm">Admission guidance chat interface.</p>
          </div>
          <div className="text-theme-muted text-xs font-extrabold uppercase tracking-wider">
            Safe • Helpful • GCJ-focused
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-white font-extrabold">Conversation</div>
                <div className="text-theme-muted text-sm mt-1">Ask anything about admissions and study programs.</div>
              </div>
            </div>

            <div className="mt-4 h-[420px] overflow-auto pr-1 space-y-4">
              {loading ? (
                <>
                  <SkeletonBubble />
                  <SkeletonBubble />
                  <SkeletonBubble />
                </>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-3xl px-4 py-3 border text-sm leading-relaxed transition-all duration-200 ${
                        m.role === 'user'
                          ? 'bg-theme-primary text-white border-theme-primary/30'
                          : 'bg-theme-primary-light/10 text-theme-text border-theme-border/60'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={ask} className="mt-4 flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={chatFooter}
                rows={2}
                className="flex-1 bg-theme-primary-light/10 border border-theme-border/60 rounded-2xl py-2.5 px-3 text-xs text-theme-text outline-none focus:border-brand-gold resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="px-4 py-3 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-extrabold uppercase tracking-wider border border-theme-primary/30 shadow-md cursor-pointer disabled:bg-theme-primary/50 disabled:cursor-not-allowed inline-flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" /> Send
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="glass border border-theme-border/60 rounded-3xl p-5 sm:p-6">
            <div className="text-white font-extrabold">Suggested Questions</div>
            <div className="text-theme-muted text-sm mt-1">Quick prompts to help you start.</div>

            <div className="mt-4 space-y-3">
              {[
                'Eligibility criteria for BS CS?',
                'What is the fee range for BS programs?',
                'How to apply to Admissions Portal?',
                'Which faculty members teach CS?',
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setInput(q)}
                  className="w-full text-left bg-theme-primary-light/10 border border-theme-border/60 hover:bg-theme-primary-light/20 transition-colors rounded-2xl px-3 py-3 text-xs text-theme-text"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-3xl bg-theme-primary-light/10 border border-theme-border/60">
              <div className="text-white font-extrabold text-sm">Tip</div>
              <div className="text-theme-muted text-sm mt-2">
                Ask with keywords like <span className="font-extrabold text-theme-text">fee</span>, <span className="font-extrabold text-theme-text">eligibility</span>, or <span className="font-extrabold text-theme-text">courses</span>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

