import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, GraduationCap } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About GCJ', path: '/about' },
  { name: 'Departments', path: '/departments' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Faculty Directory', path: '/faculty' },
  { name: 'News & Events', path: '/news' },
  { name: 'Campus Gallery', path: '/gallery' },
  { name: 'Contact Us', path: '/contact' },
];

export default function Navbar({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 glass w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <NavLink to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-theme-primary to-brand-gold flex items-center justify-center shadow-lg shadow-theme-primary/20"
            >
              <GraduationCap className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-theme-text group-hover:text-brand-gold transition-colors duration-250 m-0 leading-none">
                Govt. College Jhang
              </h1>
              <span className="text-[10px] text-brand-gold font-semibold tracking-wider uppercase">
                Est. 1926 | Centenary Excellence
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 uppercase tracking-wide ${
                    isActive
                      ? 'text-brand-gold bg-theme-primary-light border border-theme-primary/10'
                      : 'text-theme-muted hover:text-theme-text hover:bg-theme-primary-light/50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Section Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-theme-primary-light/40 hover:bg-theme-primary-light border border-theme-border text-theme-text hover:text-brand-gold transition-all duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Mobile Menu Toggle Button */}
            <div className="xl:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className="p-2.5 rounded-xl bg-theme-primary-light/40 hover:bg-theme-primary-light border border-theme-border text-theme-text transition-all duration-200 cursor-pointer"
                aria-label="Open main menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Framer Motion) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="xl:hidden glass border-t border-theme-border"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 uppercase tracking-wide ${
                      isActive
                        ? 'text-brand-gold bg-theme-primary-light border border-theme-primary/10 pl-6'
                        : 'text-theme-muted hover:text-theme-text hover:bg-theme-primary-light/30'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
