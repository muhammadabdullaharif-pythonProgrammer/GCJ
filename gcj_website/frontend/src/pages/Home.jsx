import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, GraduationCap, Users, Calendar, Award, ExternalLink, Bell, Clock } from 'lucide-react';
import { api } from '../utils/api';

export default function Home() {
  const [news, setNews] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    async function loadHomeData() {
      const allNews = await api.getNewsEvents();
      setNews(allNews.slice(0, 3)); // Top 3

      const allDepts = await api.getDepartments();
      setDepartments(allDepts.slice(0, 3)); // Top 3

      const allNotices = await api.getNotices();
      setNotices(allNotices);
    }
    loadHomeData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-16 pb-16"
    >
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass border border-theme-border/60 p-8 md:p-16 flex flex-col xl:flex-row items-center justify-between shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-theme-primary/10 via-transparent to-brand-gold/5 pointer-events-none" />
        
        <div className="max-w-3xl space-y-6 text-left z-10">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-gold/10 text-brand-gold border border-brand-gold/30 uppercase tracking-widest"
          >
            <Award className="w-3.5 h-3.5 mr-1.5" />
            100 Years of Academic Distinction
          </motion.span>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
            Shaping Minds, <br/>
            <span className="gradient-text-navy-gold">
              Building Futures
            </span>
          </h2>
          
          <p className="text-theme-muted text-base sm:text-lg leading-relaxed max-w-2xl">
            Welcome to Government College Jhang, a century-old beacon of knowledge, culture, and innovation. Explore state-of-the-art laboratories, undergraduate BS programs, and custom AI Student Advisors guiding your path.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3.5 sm:space-y-0 sm:space-x-4 pt-4">
            <NavLink 
              to="/admissions"
              className="px-7 py-3.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-semibold shadow-lg shadow-theme-primary/25 hover:shadow-theme-primary/40 transition-all duration-200 flex items-center justify-center space-x-2 border border-theme-primary"
            >
              <span>Apply Online Portal</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>
            
            <NavLink 
              to="/about"
              className="px-7 py-3.5 rounded-xl glass hover:bg-theme-primary-light/10 text-theme-text hover:text-brand-gold font-semibold transition-all duration-200 border border-theme-border flex items-center justify-center space-x-2"
            >
              <span>Discover History</span>
            </NavLink>
          </div>
        </div>

        {/* Hero Visual Seal */}
        <div className="mt-12 xl:mt-0 relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-theme-primary/20 to-brand-gold/25 rounded-full blur-3xl animate-pulse" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-2 border-dashed border-brand-gold/30 rounded-full"
          />
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-theme-border/80 flex items-center justify-center glass shadow-2xl">
            <GraduationCap className="w-24 h-24 text-brand-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]" />
          </div>
        </div>
      </section>

      {/* Announcement Ticker */}
      {notices.length > 0 && (
        <section className="glass rounded-2xl overflow-hidden flex items-center h-14 border border-theme-border/60">
          <div className="h-full bg-theme-primary px-4 sm:px-6 flex items-center space-x-2 text-white text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap z-10 shadow-lg shadow-theme-primary/10">
            <Bell className="w-4 h-4 text-brand-gold animate-bounce" />
            <span>Notices</span>
          </div>
          <div className="flex-grow overflow-hidden relative h-full flex items-center">
            <div className="animate-[marquee_25s_linear_infinite] whitespace-nowrap flex space-x-12 absolute left-0 text-sm font-medium text-theme-text">
              {notices.map((notice) => (
                <div key={notice.id} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  <span className="font-semibold">{notice.title}</span>
                  <span className="text-theme-light text-xs">({notice.created_at})</span>
                </div>
              ))}
              {/* Duplicate for infinite loop */}
              {notices.map((notice) => (
                <div key={`dup-${notice.id}`} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  <span className="font-semibold">{notice.title}</span>
                  <span className="text-theme-light text-xs">({notice.created_at})</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Counter Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Enrolled Students', count: '5,000+', icon: <Users className="w-6 h-6 text-brand-gold" />, desc: 'Secondary & Tertiary' },
          { label: 'Dedicated Faculty', count: '150+', icon: <GraduationCap className="w-6 h-6 text-brand-gold" />, desc: 'M.Phil & Ph.D Scholars' },
          { label: 'Academic Departments', count: '15+', icon: <BookOpen className="w-6 h-6 text-brand-gold" />, desc: 'Science, Arts & Business' },
          { label: 'Years of Prestige', count: '100', icon: <Award className="w-6 h-6 text-brand-gold" />, desc: 'Established in 1926' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl glass border border-theme-border/50 flex flex-col items-center justify-center text-center space-y-2 hover-gold-glow transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-theme-primary-light/40 flex items-center justify-center mb-2">
              {stat.icon}
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">
              {stat.count}
            </h3>
            <span className="text-xs sm:text-sm font-bold text-theme-text uppercase tracking-wide">
              {stat.label}
            </span>
            <p className="text-[11px] text-theme-muted">
              {stat.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Featured Departments */}
      <section className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-7 h-7 text-brand-gold" />
              <span>Academic Departments</span>
            </h3>
            <p className="text-theme-muted text-sm mt-1">Explore our key academic pathways providing premium, research-driven learning programs.</p>
          </div>
          <NavLink
            to="/departments"
            className="text-brand-gold hover:text-white text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center space-x-1.5 group transition-colors cursor-pointer"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <motion.div
              key={dept.id}
              whileHover={{ y: -6 }}
              className="rounded-2xl overflow-hidden glass border border-theme-border/50 flex flex-col hover-gold-glow transition-all duration-300 shadow-lg text-left"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={dept.image_url} 
                  alt={dept.name} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-[#0b132b]/85 border border-brand-gold/30 text-[10px] text-brand-gold font-bold uppercase tracking-wider">
                  Seats: {dept.total_seats}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white leading-snug">{dept.name}</h4>
                  <p className="text-theme-muted text-xs leading-relaxed line-clamp-3">{dept.description}</p>
                </div>
                <div className="pt-4 border-t border-theme-border/40 flex items-center justify-between text-xs text-theme-light">
                  <span>HOD: <strong className="text-theme-text font-medium">{dept.hod_details.name}</strong></span>
                  <NavLink 
                    to="/departments" 
                    className="text-brand-gold hover:text-white font-semibold flex items-center space-x-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </NavLink>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* News & Events Preview */}
      <section className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center space-x-2">
              <Calendar className="w-7 h-7 text-brand-gold" />
              <span>Latest News & Events</span>
            </h3>
            <p className="text-theme-muted text-sm mt-1">Keep yourself updated with the events, notices, and happenings on our campus.</p>
          </div>
          <NavLink
            to="/news"
            className="text-brand-gold hover:text-white text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center space-x-1.5 group transition-colors cursor-pointer"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </NavLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl glass border border-theme-border/50 flex flex-col justify-between space-y-4 hover-gold-glow transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center text-xs text-theme-light space-x-3">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white line-clamp-2 leading-snug hover:text-brand-gold transition-colors">
                  {item.title}
                </h4>
                <p className="text-theme-muted text-xs leading-relaxed line-clamp-3">
                  {item.body}
                </p>
              </div>

              <NavLink 
                to="/news"
                className="text-brand-gold hover:text-white text-xs font-semibold flex items-center space-x-1 pt-2"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3 h-3" />
              </NavLink>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Links Banner */}
      <section className="p-8 md:p-12 rounded-3xl bg-navy-gold-grad border border-theme-border/60 relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-left shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -z-10" />
        
        <div className="space-y-4 max-w-xl">
          <h3 className="text-2xl font-serif font-bold text-white">Need Guidance on GCJ Academic Offerings?</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Consult our floating AI Academic Advisor on the bottom-right corner of the page. Powered by Google Gemini, it instantly resolves queries regarding fee records, courses, curriculum, and admissions.
          </p>
        </div>

        <div className="mt-6 md:mt-0 flex-shrink-0 grid grid-cols-2 gap-3 w-full md:w-auto">
          {[
            { label: 'Merit Calculator', path: '/admissions' },
            { label: 'Faculty Directory', path: '/faculty' },
            { label: 'Campus Gallery', path: '/gallery' },
            { label: 'Contact Office', path: '/contact' }
          ].map((link, idx) => (
            <NavLink
              key={idx}
              to={link.path}
              className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-brand-gold hover:bg-white/10 text-white font-semibold text-center text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-1"
            >
              <span>{link.label}</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-gold" />
            </NavLink>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
