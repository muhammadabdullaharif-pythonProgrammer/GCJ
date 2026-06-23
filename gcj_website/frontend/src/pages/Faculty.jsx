import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, GraduationCap, Users, Mail, BookOpen, Clock } from 'lucide-react';
import { api } from '../utils/api';

export default function Faculty() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [depts, setDepts] = useState([]);
  
  // Filter settings
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDesignation, setActiveDesignation] = useState('ALL');
  const [activeDept, setActiveDept] = useState('ALL');

  useEffect(() => {
    async function loadFacultyData() {
      const allTeachers = await api.getTeachers();
      setTeachers(allTeachers);
      setFilteredTeachers(allTeachers);
      
      const allDepts = await api.getDepartments();
      setDepts(allDepts);
    }
    loadFacultyData();
  }, []);

  useEffect(() => {
    let result = teachers;

    // Filter by Designation
    if (activeDesignation !== 'ALL') {
      result = result.filter(t => t.designation.toUpperCase() === activeDesignation);
    }

    // Filter by Department
    if (activeDept !== 'ALL') {
      result = result.filter(t => t.department === parseInt(activeDept));
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.user_details.name.toLowerCase().includes(query) || 
        t.qualification.toLowerCase().includes(query) ||
        t.designation.toLowerCase().includes(query)
      );
    }

    setFilteredTeachers(result);
  }, [searchQuery, activeDesignation, activeDept, teachers]);

  const getDeptName = (id) => {
    const d = depts.find(dept => dept.id === id);
    return d ? d.name : 'General Academics';
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
          Faculty Directory
        </h2>
        <span className="text-xs sm:text-sm text-brand-gold font-semibold uppercase tracking-widest">
          Meet Our Distinguished Instructors & Researchers
        </span>
        <p className="text-theme-muted text-sm sm:text-base max-w-2xl leading-relaxed text-center">
          GCJ Jhang employs highly trained scholars committed to academic rigor, teaching excellence, and providing custom mentors to guide student pathways.
        </p>
      </section>

      {/* Search and Filters Section */}
      <section className="space-y-4">
        
        {/* Row 1: Search and Department Selector */}
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, credential, title..."
              className="w-full bg-theme-primary-light/15 border border-theme-border/60 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl py-3 pl-11 pr-4 text-sm text-theme-text outline-none transition-all placeholder:text-theme-light"
            />
          </div>

          {/* Department Select Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs text-theme-light font-bold uppercase tracking-wider whitespace-nowrap">Department:</span>
            <select
              value={activeDept}
              onChange={(e) => setActiveDept(e.target.value)}
              className="w-full md:w-[240px] bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-2.5 px-4 text-xs text-theme-text outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">All Departments</option>
              {depts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Designation Filter Tabs */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-theme-light font-bold uppercase tracking-wider mr-2">Designation:</span>
          {[
            { label: 'All ranks', value: 'ALL' },
            { label: 'Professor', value: 'PROFESSOR' },
            { label: 'Associate Professor', value: 'ASSOCIATE PROFESSOR' },
            { label: 'Assistant Professor', value: 'ASSISTANT PROFESSOR' },
            { label: 'Lecturer', value: 'LECTURER' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveDesignation(tab.value)}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeDesignation === tab.value
                  ? 'bg-theme-primary text-white border border-theme-primary'
                  : 'text-theme-muted hover:text-theme-text hover:bg-theme-primary-light/25 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </section>

      {/* Directory Grid */}
      <section className="min-h-[300px]">
        {filteredTeachers.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredTeachers.map((teacher) => (
                <motion.div
                  key={teacher.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl glass hover:border-brand-gold/30 border border-theme-border/50 flex flex-col justify-between hover-gold-glow transition-all duration-300 space-y-4"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start space-x-4 text-left">
                      <div className="w-12 h-12 rounded-xl bg-theme-primary flex items-center justify-center font-bold text-brand-gold flex-shrink-0 text-lg shadow-md shadow-theme-primary/10 border border-theme-border/40">
                        {teacher.user_details.name.split(' ').slice(-1)[0][0] || 'T'}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-extrabold text-white leading-tight">
                          {teacher.user_details.name}
                        </h4>
                        <span className="text-[10px] text-brand-gold uppercase tracking-wider font-semibold block bg-theme-primary-light/40 border border-theme-primary/10 px-2 py-0.5 rounded w-max">
                          {teacher.designation.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Department Tag */}
                    <div className="flex items-center space-x-2 text-xs text-theme-muted">
                      <BookOpen className="w-4 h-4 text-brand-gold flex-shrink-0" />
                      <span className="truncate font-semibold">{getDeptName(teacher.department)}</span>
                    </div>
                  </div>

                  {/* Body Coordinates */}
                  <div className="space-y-2.5 pt-3 border-t border-theme-border/30 text-xs">
                    <p className="text-theme-muted flex items-start">
                      <GraduationCap className="w-4 h-4 mr-2 text-brand-gold flex-shrink-0 mt-0.5" />
                      <span><strong>Credentials:</strong> {teacher.qualification}</span>
                    </p>
                    <p className="text-theme-light flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-brand-gold flex-shrink-0" />
                      <span>Joined: {new Date(teacher.joining_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </p>
                    <a 
                      href={`mailto:${teacher.user_details.email}`} 
                      className="text-brand-gold hover:text-white flex items-center space-x-1.5 transition-colors duration-150 mt-1"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{teacher.user_details.email}</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-12 glass border border-theme-border/60 rounded-3xl">
            <Users className="w-12 h-12 text-theme-light mx-auto mb-3" />
            <p className="text-theme-muted text-sm font-semibold">No teachers matching criteria were found.</p>
          </div>
        )}
      </section>
    </motion.div>
  );
}
