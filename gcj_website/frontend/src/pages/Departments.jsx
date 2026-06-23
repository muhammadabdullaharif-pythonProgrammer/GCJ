import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, GraduationCap, Users, ArrowRight } from 'lucide-react';
import { api } from '../utils/api';

// Helper function to dynamically map departments to categories
const getDeptCategory = (name) => {
  const scienceDepts = ['computer science & it', 'chemistry', 'physics', 'mathematics'];
  const commerceDepts = ['commerce & business administration', 'commerce', 'business'];
  const lowerName = name.toLowerCase();

  if (scienceDepts.some(s => lowerName.includes(s))) return 'SCIENCES';
  if (commerceDepts.some(c => lowerName.includes(c))) return 'COMMERCE';
  return 'HUMANITIES';
};

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [filteredDepts, setFilteredDepts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    async function loadDepts() {
      const data = await api.getDepartments();
      setDepartments(data);
      setFilteredDepts(data);
    }
    loadDepts();
  }, []);

  useEffect(() => {
    let result = departments;

    // Filter by Tab category
    if (activeTab !== 'ALL') {
      result = result.filter(d => getDeptCategory(d.name) === activeTab);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(query) || 
        d.description.toLowerCase().includes(query) ||
        d.hod_details.name.toLowerCase().includes(query)
      );
    }

    setFilteredDepts(result);
  }, [searchQuery, activeTab, departments]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-12 pb-16 text-left"
    >
      {/* Header Banner */}
      <section className="relative rounded-3xl overflow-hidden glass border border-theme-border/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="absolute inset-0 bg-gradient-to-tr from-theme-primary/10 to-brand-gold/5 pointer-events-none" />
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
          Academic Departments
        </h2>
        <span className="text-xs sm:text-sm text-brand-gold font-semibold uppercase tracking-widest">
          Comprehensive Secondary & Tertiary Faculty Pathways
        </span>
        <p className="text-theme-muted text-sm sm:text-base max-w-2xl leading-relaxed text-center">
          GCJ Jhang hosts highly qualified professors and lecturers. Explore our specialized departments, course contents, total seat details, and leaders guiding student paths.
        </p>
      </section>

      {/* Search and Category Filters */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 bg-theme-primary-light/10 p-1.5 rounded-2xl border border-theme-border/40 w-full md:w-auto">
          {[
            { label: 'All Faculty', value: 'ALL' },
            { label: 'Sciences', value: 'SCIENCES' },
            { label: 'Humanities & Arts', value: 'HUMANITIES' },
            { label: 'Commerce & Business', value: 'COMMERCE' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === tab.value
                  ? 'bg-theme-primary text-white shadow shadow-theme-primary/25 border border-theme-primary'
                  : 'text-theme-muted hover:text-theme-text hover:bg-theme-primary-light/35'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-[320px]">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search departments or HODs..."
            className="w-full bg-theme-primary-light/15 border border-theme-border/60 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl py-3 pl-11 pr-4 text-sm text-theme-text outline-none transition-all placeholder:text-theme-light"
          />
        </div>
      </section>

      {/* Departments Grid */}
      <section className="min-h-[300px]">
        {filteredDepts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredDepts.map((dept) => (
                <motion.div
                  key={dept.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl overflow-hidden glass border border-theme-border/50 flex flex-col hover-gold-glow transition-all duration-300 shadow-lg"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src={dept.image_url} 
                      alt={dept.name} 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded bg-[#0b132b]/85 border border-brand-gold/30 text-[10px] text-brand-gold font-bold uppercase tracking-wider">
                      Seats: {dept.total_seats}
                    </div>
                    <div className="absolute bottom-4 left-4 px-2 py-0.5 rounded bg-theme-primary/90 text-[10px] text-white font-bold uppercase tracking-wider">
                      {getDeptCategory(dept.name)}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-white leading-snug">{dept.name}</h4>
                      <p className="text-theme-muted text-xs leading-relaxed line-clamp-3">{dept.description}</p>
                    </div>

                    <div className="pt-4 border-t border-theme-border/40 space-y-4">
                      {/* HOD info */}
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-theme-primary-light/50 flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-brand-gold" />
                        </div>
                        <div className="text-xs">
                          <p className="text-theme-light">HOD Profile</p>
                          <p className="text-theme-text font-bold leading-tight">{dept.hod_details.name}</p>
                        </div>
                      </div>
                      
                      <NavLink 
                        to={`/departments/${dept.id}`}
                        className="w-full py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1 border border-theme-primary shadow-sm cursor-pointer"
                      >
                        <span>View Details & Courses</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </NavLink>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-12 glass border border-theme-border/60 rounded-3xl">
            <BookOpen className="w-12 h-12 text-theme-light mx-auto mb-3" />
            <p className="text-theme-muted text-sm font-semibold">No departments matching search queries found.</p>
          </div>
        )}
      </section>
    </motion.div>
  );
}
