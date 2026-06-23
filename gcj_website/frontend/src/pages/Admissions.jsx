import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, GraduationCap, Calculator, FileText, CheckCircle2, Phone, Mail, User, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';

export default function Admissions() {
  const [courses, setCourses] = useState([]);
  const [depts, setDepts] = useState([]);
  
  // Merit Calculator State
  const [calcType, setCalcType] = useState('BS'); // BS or INTER
  const [matricObt, setMatricObt] = useState('');
  const [matricTot, setMatricTot] = useState('1100');
  const [interObt, setInterObt] = useState('');
  const [interTot, setInterTot] = useState('1100');
  const [meritResult, setMeritResult] = useState(null);

  // Admission Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deptId: '',
    courseId: '',
    matricMarks: '',
    interMarks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    async function loadFormSelectors() {
      const allDepts = await api.getDepartments();
      setDepts(allDepts);
      const allCourses = await api.getCourses();
      setCourses(allCourses);
    }
    loadFormSelectors();
  }, []);

  // Calculate merit
  const handleCalculateMerit = (e) => {
    e.preventDefault();
    const matricObtNum = parseFloat(matricObt);
    const matricTotNum = parseFloat(matricTot);
    
    if (isNaN(matricObtNum) || isNaN(matricTotNum) || matricObtNum > matricTotNum || matricObtNum < 0) {
      alert("Please enter valid Matric marks.");
      return;
    }

    const matricPct = (matricObtNum / matricTotNum) * 100;

    if (calcType === 'INTER') {
      // 100% Matric
      setMeritResult(matricPct.toFixed(2));
    } else {
      // BS: 30% Matric + 70% Inter
      const interObtNum = parseFloat(interObt);
      const interTotNum = parseFloat(interTot);
      
      if (isNaN(interObtNum) || isNaN(interTotNum) || interObtNum > interTotNum || interObtNum < 0) {
        alert("Please enter valid Intermediate marks.");
        return;
      }

      const interPct = (interObtNum / interTotNum) * 100;
      const totalMerit = (matricPct * 0.3) + (interPct * 0.7);
      setMeritResult(totalMerit.toFixed(2));
    }
  };

  // Submit application form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.deptId || !formData.matricMarks) {
      setFeedback({ status: 'error', message: 'Please fill in all required fields marked with *.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      student_name: formData.name,
      student_email: formData.email,
      student_phone: formData.phone,
      student_roll_no: Math.floor(Math.random() * 80000 + 10000).toString(),
      department: parseInt(formData.deptId),
      merit_score: parseFloat(formData.interMarks ? (parseFloat(formData.matricMarks)/1100 * 30 + parseFloat(formData.interMarks)/1100 * 70).toFixed(2) : (parseFloat(formData.matricMarks)/1100 * 100).toFixed(2)),
      applied_course_id: formData.courseId ? parseInt(formData.courseId) : null
    };

    try {
      const response = await api.submitAdmission(payload);
      setIsSubmitting(false);
      if (response.success) {
        setFeedback({
          status: 'success',
          message: `Application submitted successfully! Your student tracking code is ${response.data.student.roll_no}. Our administration office will evaluate your merit scores and contact you soon.`
        });
        setFormData({ name: '', email: '', phone: '', deptId: '', courseId: '', matricMarks: '', interMarks: '' });
      } else {
        setFeedback({ status: 'error', message: 'The admissions endpoint returned an error. Please try again.' });
      }
    } catch (error) {
      setIsSubmitting(false);
      setFeedback({ status: 'error', message: 'Network connection failed. Please try again later.' });
    }
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
          Admissions Portal
        </h2>
        <span className="text-xs sm:text-sm text-brand-gold font-semibold uppercase tracking-widest">
          Register Online & Calculate Merit Instantly
        </span>
        <p className="text-theme-muted text-sm sm:text-base max-w-2xl leading-relaxed text-center">
          Join Govt. College Jhang for the Fall 2026 academic term. Apply for BS (Hons) 4-Year degrees or 2-Year Intermediate classes. Evaluate your merit weightage dynamically.
        </p>
      </section>

      {/* Main Grid: Requirements & Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left: Requirements & Criteria */}
        <section className="glass border border-theme-border/50 p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2 border-b border-theme-border/40 pb-3">
            <FileText className="w-5 h-5 text-brand-gold" />
            <span>Admission Requirements</span>
          </h3>

          <div className="space-y-4 text-sm leading-relaxed text-theme-muted">
            <div className="space-y-2">
              <h4 className="font-bold text-white text-base flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-brand-gold" />
                <span>BS (Hons) Undergraduate Admissions</span>
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>Candidates must hold an Intermediate certificate (F.Sc, ICS, I.Com, FA) or equivalent.</li>
                <li>Minimum of 50% marks required for BS Computer Science and BS Information Technology.</li>
                <li>Minimum of 45% marks required for BS Chemistry, Physics, Mathematics, English, and BBA.</li>
                <li>Merit weightage: 30% Matriculation marks + 70% Intermediate board marks.</li>
              </ul>
            </div>

            <div className="space-y-2 pt-4">
              <h4 className="font-bold text-white text-base flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-brand-gold" />
                <span>Intermediate Admissions</span>
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>Candidates must hold a Matriculation (SSC) certificate with Science or Arts subjects.</li>
                <li>Minimum of 45% marks required for general Intermediate streams (FA).</li>
                <li>Minimum of 50% marks required for F.Sc Pre-Medical, Pre-Engineering, and ICS.</li>
                <li>Merit is determined solely on Matriculation board exam marks (100%).</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Right: Dynamic Merit Calculator */}
        <section className="glass border border-theme-border/50 p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2 border-b border-theme-border/40 pb-3">
            <Calculator className="w-5 h-5 text-brand-gold" />
            <span>GCJ Merit Calculator</span>
          </h3>

          {/* Type Selector tabs */}
          <div className="flex bg-theme-primary-light/10 p-1 rounded-xl border border-theme-border/30">
            <button
              onClick={() => { setCalcType('BS'); setMeritResult(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                calcType === 'BS' ? 'bg-theme-primary text-white' : 'text-theme-muted hover:text-theme-text'
              }`}
            >
              BS Programs (30/70)
            </button>
            <button
              onClick={() => { setCalcType('INTER'); setMeritResult(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                calcType === 'INTER' ? 'bg-theme-primary text-white' : 'text-theme-muted hover:text-theme-text'
              }`}
            >
              Intermediate (100%)
            </button>
          </div>

          <form onSubmit={handleCalculateMerit} className="space-y-4">
            {/* Matric Marks */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Matric Obtained *</label>
                <input
                  type="number"
                  required
                  value={matricObt}
                  onChange={(e) => setMatricObt(e.target.value)}
                  placeholder="e.g. 980"
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-lg py-2.5 px-3 text-xs text-theme-text outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Matric Total *</label>
                <input
                  type="number"
                  required
                  value={matricTot}
                  onChange={(e) => setMatricTot(e.target.value)}
                  placeholder="1100"
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-lg py-2.5 px-3 text-xs text-theme-text outline-none"
                />
              </div>
            </div>

            {/* Intermediate Marks (only for BS) */}
            {calcType === 'BS' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Intermediate Obtained *</label>
                  <input
                    type="number"
                    required
                    value={interObt}
                    onChange={(e) => setInterObt(e.target.value)}
                    placeholder="e.g. 940"
                    className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-lg py-2.5 px-3 text-xs text-theme-text outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Intermediate Total *</label>
                  <input
                    type="number"
                    required
                    value={interTot}
                    onChange={(e) => setInterTot(e.target.value)}
                    placeholder="1100"
                    className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-lg py-2.5 px-3 text-xs text-theme-text outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold tracking-wider uppercase border border-theme-primary shadow-md cursor-pointer transition-colors"
            >
              Compute Eligibility Index
            </button>
          </form>

          {/* Calculator Results */}
          <AnimatePresence>
            {meritResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="p-5 rounded-2xl bg-theme-primary-light/20 border border-brand-gold/30 flex flex-col items-center justify-center text-center space-y-2"
              >
                <span className="text-xs text-theme-light font-semibold uppercase tracking-wider">Estimated Merit Score</span>
                <h4 className="text-3xl sm:text-4xl font-extrabold text-brand-gold leading-none">{meritResult}%</h4>
                <p className="text-[11px] text-theme-muted leading-relaxed max-w-xs">
                  {parseFloat(meritResult) >= 60 
                    ? "Congratulations! You possess high chances of eligibility for majority of courses. Submit your application below."
                    : "You are eligible to apply. Seats are allocated dynamically based on competitive cohort scores."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Online Application Form */}
      <section className="glass border border-theme-border/50 p-6 sm:p-10 rounded-3xl max-w-3xl mx-auto space-y-8">
        <div className="border-b border-theme-border/40 pb-4 text-center">
          <h3 className="text-2xl font-serif font-bold text-white">Online Application Form</h3>
          <p className="text-theme-muted text-xs sm:text-sm mt-1">Submit your academic details to request enrollment registration.</p>
        </div>

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

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-light" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Muhammad Abdullah"
                className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl py-3 pl-11 pr-4 text-xs text-theme-text outline-none transition-all"
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-light" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. name@example.com"
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl py-3 pl-11 pr-4 text-xs text-theme-text outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-light" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl py-3 pl-11 pr-4 text-xs text-theme-text outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Select Department & Course */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Department *</label>
              <select
                required
                value={formData.deptId}
                onChange={(e) => setFormData({ ...formData, deptId: e.target.value, courseId: '' })}
                className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-3 px-4 text-xs text-theme-text outline-none cursor-pointer appearance-none"
              >
                <option value="" className="bg-theme-footer">Select Department</option>
                {depts.map((d) => (
                  <option key={d.id} value={d.id} className="bg-theme-footer">{d.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Select Program (Optional)</label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                disabled={!formData.deptId}
                className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold rounded-xl py-3 px-4 text-xs text-theme-text outline-none cursor-pointer appearance-none disabled:opacity-50"
              >
                <option value="" className="bg-theme-footer">Select Course</option>
                {courses
                  .filter((c) => c.department === parseInt(formData.deptId))
                  .map((c) => (
                    <option key={c.id} value={c.id} className="bg-theme-footer">{c.name} ({c.code})</option>
                  ))}
              </select>
            </div>
          </div>

          {/* Academic Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Matric Obtained Marks *</label>
              <input
                type="number"
                required
                value={formData.matricMarks}
                onChange={(e) => setFormData({ ...formData, matricMarks: e.target.value })}
                placeholder="e.g. 1010"
                className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl py-3 px-4 text-xs text-theme-text outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-theme-light font-bold uppercase tracking-wide">Intermediate Obtained (if BS)</label>
              <input
                type="number"
                value={formData.interMarks}
                onChange={(e) => setFormData({ ...formData, interMarks: e.target.value })}
                placeholder="e.g. 960"
                className="w-full bg-theme-primary-light/10 border border-theme-border/60 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl py-3 px-4 text-xs text-theme-text outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover disabled:bg-theme-primary/50 text-white font-bold tracking-wider uppercase border border-theme-primary shadow-lg shadow-theme-primary/20 transition-all cursor-pointer"
          >
            {isSubmitting ? "Submitting Registration request..." : "Submit Online Admission Request"}
          </button>
        </form>
      </section>
    </motion.div>
  );
}
