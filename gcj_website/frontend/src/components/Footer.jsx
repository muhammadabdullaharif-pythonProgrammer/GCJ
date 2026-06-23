import React from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, Mail, Facebook, Twitter, Youtube, Linkedin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-theme-footer text-gray-300 border-t border-theme-border/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
          
          {/* Column 1: College Intro */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-brand-gold flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-[#0b132b]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg leading-tight">Govt. College Jhang</h4>
                <span className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider">Est. 1926</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A century-old institution shaping the intellectual landscape of Central Punjab. Committed to academic prestige, holistic learning, and tech-driven education.
            </p>
            <div className="flex space-x-3 pt-2">
              {[
                { icon: <Facebook className="w-5 h-5" />, href: "https://facebook.com", color: "hover:bg-blue-600 hover:text-white" },
                { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com", color: "hover:bg-sky-500 hover:text-white" },
                { icon: <Youtube className="w-5 h-5" />, href: "https://youtube.com", color: "hover:bg-red-600 hover:text-white" },
                { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com", color: "hover:bg-blue-700 hover:text-white" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-lg bg-gray-800/80 border border-gray-700/60 flex items-center justify-center text-gray-400 transition-all duration-200 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Academic Departments */}
          <div>
            <h4 className="text-white font-semibold text-base mb-6 border-l-4 border-brand-gold pl-3 uppercase tracking-wider">
              Departments
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Computer Science & IT', path: '/departments' },
                { name: 'Chemistry', path: '/departments' },
                { name: 'Physics', path: '/departments' },
                { name: 'English Literature', path: '/departments' },
                { name: 'Mathematics', path: '/departments' },
                { name: 'Commerce & BBA', path: '/departments' },
              ].map((dept, index) => (
                <li key={index}>
                  <NavLink
                    to={dept.path}
                    className="text-gray-400 hover:text-brand-gold text-sm transition-colors duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                    <span>{dept.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-base mb-6 border-l-4 border-brand-gold pl-3 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Online Admissions', path: '/admissions' },
                { name: 'About History & Vision', path: '/about' },
                { name: 'Faculty Members', path: '/faculty' },
                { name: 'News & Announcements', path: '/news' },
                { name: 'Campus Gallery Grid', path: '/gallery' },
                { name: 'Get In Touch', path: '/contact' },
              ].map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className="text-gray-400 hover:text-brand-gold text-sm transition-colors duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                    <span>{link.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div>
            <h4 className="text-white font-semibold text-base mb-6 border-l-4 border-brand-gold pl-3 uppercase tracking-wider">
              Campus Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Gojra Road, Jhang Sadar, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone className="w-5 h-5 text-brand-gold flex-shrink-0" />
                <span className="text-gray-400">+92 (47) 9200123</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail className="w-5 h-5 text-brand-gold flex-shrink-0" />
                <a href="mailto:info@gcj.edu.pk" className="text-gray-400 hover:text-brand-gold transition-colors">
                  info@gcj.edu.pk
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Sub Footer Section */}
        <div className="border-t border-gray-800/80 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} Government College Jhang Official Portal. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-gray-300 cursor-pointer transition-colors duration-150">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors duration-150">Terms of Service</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors duration-150">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
