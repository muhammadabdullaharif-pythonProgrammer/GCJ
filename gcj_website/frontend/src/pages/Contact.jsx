import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.subject || !formState.message) {
      setFeedback({ status: 'error', message: 'Please fill in all inquiry fields.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    // Simulate contact submission response
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback({
        status: 'success',
        message: 'Thank you for reaching out! Your inquiry has been sent to our academic desk. We will get back to you shortly.'
      });
      setFormState({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-12 pb-16 text-left font-sans"
    >
      {/* Banner */}
      <section className="relative rounded-3xl overflow-hidden glass border border-theme-border/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="absolute inset-0 bg-gradient-to-tr from-theme-primary/10 to-brand-gold/5 pointer-events-none" />
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
          Contact Administration
        </h2>
        <span className="text-xs sm:text-sm text-brand-gold font-semibold uppercase tracking-widest">
          Have Queries? Reach Out to Our Admissions Desk
        </span>
        <p className="text-theme-muted text-sm sm:text-base max-w-2xl leading-relaxed text-center font-sans">
          Find our geographic campus coordinates, phone details, and email endpoints below. Submit an inquiry form to connect with us directly.
        </p>
      </section>

      {/* Main Grid: Coordinates & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Left: Contact Info details */}
        <div className="lg:col-span-1 space-y-6 flex flex-col justify-between">
          {[
            {
              title: 'Campus Location',
              desc: 'Gojra Road, Jhang Sadar, Punjab, Pakistan',
              icon: <MapPin className="w-6 h-6 text-brand-gold" />,
              action: 'View on map'
            },
            {
              title: 'Telephone Contacts',
              desc: '+92 (47) 9200123 / +92 (47) 9200124',
              icon: <Phone className="w-6 h-6 text-brand-gold" />,
              action: 'Call administration'
            },
            {
              title: 'Academic Email desk',
              desc: 'info@gcj.edu.pk / admissions@gcj.edu.pk',
              icon: <Mail className="w-6 h-6 text-brand-gold" />,
              action: 'Email registrar'
            }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl glass border border-theme-border/50 flex items-start space-x-4 flex-grow hover-gold-glow transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-theme-primary-light/45 flex flex-shrink-0 items-center justify-center border border-theme-border/40 shadow-sm">
                {card.icon}
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">{card.title}</h4>
                <p className="text-theme-muted text-xs sm:text-sm leading-relaxed">{card.desc}</p>
                <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block pt-1.5 opacity-90">
                  {card.action}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-2 glass border border-theme-border/50 p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-theme-border/40 pb-3 uppercase tracking-wider">
              Send an Inquiry
            </h3>

            {/* Feedback Alert */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-xl flex items-start space-x-3 border ${
                    feedback.status === 'success'
                      ? 'bg-theme-primary-light/25 text-brand-gold border-brand-gold/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                >
                  {feedback.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-brand-gold" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
                  )}
                  <span className="text-xs sm:text-sm font-semibold">{feedback.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Asma Bibi"
                    className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-2.5 px-4 text-xs text-theme-text outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="e.g. asma@example.com"
                    className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-2.5 px-4 text-xs text-theme-text outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Subject *</label>
                <input
                  type="text"
                  required
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  placeholder="e.g. BS Admissions Queries"
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-2.5 px-4 text-xs text-theme-text outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Type your question or query details here..."
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-2.5 px-4 text-xs text-theme-text outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover disabled:bg-theme-primary/50 text-white font-bold tracking-wider uppercase border border-theme-primary shadow transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? "Sending inquiry..." : "Send Message"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Embedded Map Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-white border-b border-theme-border/40 pb-3 uppercase tracking-wider">
          Campus Map Location
        </h3>
        
        <div className="rounded-3xl overflow-hidden border border-theme-border/60 h-[350px] shadow-2xl glass">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.5513757879685!2d72.32759997629555!3d31.274681674326553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x392361b7b752dfdf%3A0xc48de1d9044d01b!2sGovernment%20College%20Jhang!5e0!3m2!1sen!2spk!4v1718265000000!5m2!1sen!2spk"
            width="100%" 
            height="100%" 
            style={{ border: 0 }}
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="GCJ Campus Google Map"
          />
        </div>
      </section>
    </motion.div>
  );
}
