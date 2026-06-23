import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, Clock, ArrowLeft, Mail, Award, CheckCircle } from 'lucide-react';
import { api } from '../utils/api';

export default function DepartmentDetail() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetailData() {
      setLoading(true);
      try {
        const deptData = await api.getDepartment(id);
        setDepartment(deptData);

        const coursesData = await api.getCourses(id);
        setCourses(coursesData);

        const teachersData = await api.getTeachers(id);
        setTeachers(teachersData);
      } catch (error) {
        console.error("Error loading department details:", error);
      }
      setLoading(false);
    }
    loadDetailData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-theme-muted font-sans space-y-4">
        <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold">Loading Department details...</p>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="text-center py-16 glass border border-theme-border/60 rounded-3xl font-sans space-y-4 max-w-lg mx-auto">
        <BookOpen className="w-12 h-12 text-theme-light mx-auto" />
        <h3 className="text-lg font-bold text-white">Department Not Found</h3>
        <p className="text-theme-muted text-sm">The department ID you searched for does not exist in our system.</p>
        <NavLink 
          to="/departments" 
          className="inline-flex items-center space-x-1 text-brand-gold hover:text-white text-xs font-bold uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Departments</span>
        </NavLink>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-12 pb-16 text-left font-sans"
    >
      {/* Back Button Link */}
      <NavLink
        to="/departments"
        className="inline-flex items-center space-x-2 text-theme-light hover:text-brand-gold font-bold text-xs uppercase tracking-wider transition-colors duration-150 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Directory</span>
      </NavLink>

      {/* Main Department Banner */}
      <section className="relative rounded-3xl overflow-hidden glass border border-theme-border/60 p-8 sm:p-12 flex flex-col lg:flex-row gap-8 shadow-2xl items-center lg:items-stretch">
        <div className="lg:w-2/5 rounded-2xl overflow-hidden relative min-h-[220px]">
          <img 
            src={department.image_url} 
            alt={department.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold">{department.name}</h3>
            <p className="text-xs text-brand-gold uppercase tracking-wider font-semibold">Faculty Pathway</p>
          </div>
        </div>

        <div className="lg:w-3/5 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] bg-theme-primary-light/50 border border-theme-primary/20 px-2.5 py-1 rounded text-brand-gold font-bold uppercase tracking-wider">
              Department Profile
            </span>
            <p className="text-theme-muted text-sm leading-relaxed">
              {department.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-b border-theme-border/40 py-4">
            <div className="text-center md:text-left">
              <span className="text-xs text-theme-light">Total Seats</span>
              <p className="text-lg sm:text-2xl font-extrabold text-white">{department.total_seats}</p>
            </div>
            <div className="text-center md:text-left">
              <span className="text-xs text-theme-light">Courses</span>
              <p className="text-lg sm:text-2xl font-extrabold text-white">{courses.length}</p>
            </div>
            <div className="text-center md:text-left">
              <span className="text-xs text-theme-light">Faculty</span>
              <p className="text-lg sm:text-2xl font-extrabold text-white">{teachers.length}</p>
            </div>
          </div>

          {/* HOD Details Container */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-theme-primary-light/10 border border-theme-border/30 gap-4">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-theme-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-brand-gold" />
              </div>
              <div>
                <span className="text-[10px] text-theme-light font-medium uppercase leading-none block">Head of Department</span>
                <strong className="text-white font-bold text-sm block">{department.hod_details.name}</strong>
              </div>
            </div>
            <div className="text-xs text-left sm:text-right">
              <p className="text-theme-muted">{department.hod_details.qualification}</p>
              <a href={`mailto:${department.hod_details.email}`} className="text-brand-gold hover:text-white flex items-center justify-start sm:justify-end space-x-1.5 mt-0.5 transition-colors">
                <Mail className="w-3.5 h-3.5" />
                <span>{department.hod_details.email}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="space-y-6">
        <div>
          <h3 className="text-2xl font-serif font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-brand-gold" />
            <span>Offered Programs & Courses</span>
          </h3>
          <p className="text-theme-muted text-sm mt-1">Undergraduate BS and secondary Intermediate pathways under this department.</p>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="p-6 rounded-2xl glass hover:border-brand-gold/30 border border-theme-border/50 flex flex-col justify-between space-y-4 hover-gold-glow transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-brand-gold font-bold uppercase tracking-wider bg-theme-primary-light/50 border border-theme-primary/20 px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <span className="flex items-center text-xs text-theme-light space-x-1">
                      <Clock className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{course.duration} ({course.semester} Semesters)</span>
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-white leading-snug">{course.name}</h4>
                  
                  <div className="space-y-2 pt-2 text-xs">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <p className="text-theme-muted"><strong className="text-theme-text font-medium">Eligibility:</strong> {course.eligibility}</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Award className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <p className="text-theme-muted"><strong className="text-theme-text font-medium">Tuition Fees:</strong> {course.fee}</p>
                    </div>
                  </div>
                </div>

                <NavLink 
                  to="/admissions"
                  className="w-full py-2.5 rounded-xl bg-theme-primary-light/30 hover:bg-theme-primary border border-theme-border hover:border-theme-primary text-brand-gold hover:text-white text-xs font-bold transition-all duration-200 text-center cursor-pointer block"
                >
                  Apply For Enrollment
                </NavLink>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 glass border border-theme-border/60 rounded-3xl">
            <BookOpen className="w-10 h-10 text-theme-light mx-auto mb-2" />
            <p className="text-theme-muted text-sm">No courses recorded for this department.</p>
          </div>
        )}
      </section>

      {/* Faculty Directory Section */}
      <section className="space-y-6">
        <div>
          <h3 className="text-2xl font-serif font-bold text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-brand-gold" />
            <span>Department Faculty</span>
          </h3>
          <p className="text-theme-muted text-sm mt-1">Meet our highly skilled teaching staff dedicated to mentoring scholars.</p>
        </div>

        {teachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div 
                key={teacher.id} 
                className="p-6 rounded-2xl glass hover:border-brand-gold/30 border border-theme-border/50 flex flex-col justify-between hover-gold-glow transition-all duration-300 space-y-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-theme-primary flex items-center justify-center font-bold text-brand-gold flex-shrink-0 text-lg shadow-md shadow-theme-primary/10">
                    {teacher.user_details.name.split(' ').slice(-1)[0][0] || 'T'}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                      {teacher.user_details.name}
                    </h4>
                    <span className="text-[10px] text-brand-gold uppercase tracking-wider font-semibold block bg-theme-primary-light/40 border border-theme-primary/10 px-2 py-0.5 rounded w-max">
                      {teacher.designation.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 text-xs border-t border-theme-border/30">
                  <p className="text-theme-muted">
                    <strong className="text-theme-text font-medium">Credentials:</strong> {teacher.qualification}
                  </p>
                  <a 
                    href={`mailto:${teacher.user_details.email}`} 
                    className="text-brand-gold hover:text-white flex items-center space-x-1.5 transition-colors duration-150"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{teacher.user_details.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 glass border border-theme-border/60 rounded-3xl">
            <Users className="w-10 h-10 text-theme-light mx-auto mb-2" />
            <p className="text-theme-muted text-sm">No faculty details uploaded for this department yet.</p>
          </div>
        )}
      </section>
    </motion.div>
  );
}
