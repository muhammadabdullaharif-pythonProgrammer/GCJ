import React from 'react';
import { motion } from 'framer-motion';
import { Award, Compass, Eye, ShieldAlert, GraduationCap, Calendar, Users, MapPin } from 'lucide-react';

const milestones = [
  { year: '1926', title: 'Founding Year', desc: 'Established as an Intermediate College in Jhang Sadar to provide quality secondary education to residents of Central Punjab.' },
  { year: '1947', title: 'Post-Independence Shift', desc: 'Reorganized after independence, expanding its classes and hosting literary discussions with national poets.' },
  { year: '1970', title: 'Degree College Upgradation', desc: 'Upgraded to a Degree College, introducing undergraduate programs in humanities and science disciplines.' },
  { year: '2010', title: 'BS 4-Year Semester Launch', desc: 'In partnership with major universities, successfully rolled out 4-Year BS (Hons) programs in Computer Science and Chemistry.' },
  { year: '2026', title: 'Centenary Celebrations', desc: 'Celebrating 100 years of academic distinction, inaugurating modern tech labs and AI student advisor tools.' }
];

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-16 pb-16 text-left"
    >
      {/* Page Header */}
      <section className="relative rounded-3xl overflow-hidden glass border border-theme-border/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="absolute inset-0 bg-gradient-to-tr from-theme-primary/10 to-brand-gold/5 pointer-events-none" />
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-none">
          About Govt. College Jhang
        </h2>
        <span className="text-xs sm:text-sm text-brand-gold font-semibold uppercase tracking-widest">
          Est. 1926 | Centenary of Academic Prestige
        </span>
        <p className="text-theme-muted text-sm sm:text-base max-w-2xl leading-relaxed">
          Learn about our rich legacy, our core principles driving academic excellence, and the message from our leadership directing GCJ Jhang into the next century.
        </p>
      </section>

      {/* History & Timeline */}
      <section className="space-y-8">
        <div>
          <h3 className="text-2xl font-serif font-bold text-white flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-brand-gold" />
            <span>Our Journey (1926 - 2026)</span>
          </h3>
          <p className="text-theme-muted text-sm mt-1">A timeline charting a hundred years of building futures and academic excellence.</p>
        </div>

        <div className="relative border-l-2 border-theme-primary-light/80 ml-4 pl-6 space-y-8 max-w-4xl">
          {milestones.map((milestone, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative space-y-2"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[35px] top-1.5 w-4 h-4 rounded-full bg-brand-gold border-2 border-theme-bg shadow-md" />
              
              <span className="text-base font-extrabold text-brand-gold bg-theme-primary-light/40 border border-theme-primary/10 px-2.5 py-0.5 rounded-lg">
                {milestone.year}
              </span>
              <h4 className="text-lg font-bold text-white pt-1">{milestone.title}</h4>
              <p className="text-theme-muted text-sm leading-relaxed">{milestone.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission & Vision & Motto */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vision */}
        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 rounded-2xl glass border border-theme-border/50 space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-theme-primary-light/40 flex items-center justify-center">
            <Eye className="w-6 h-6 text-brand-gold" />
          </div>
          <h4 className="text-lg font-bold text-white">Our Vision</h4>
          <p className="text-theme-muted text-sm leading-relaxed">
            To become a premier seat of learning in Central Punjab, fostering critical thinking, research, and technical innovation while preserving ethical values and cultural heritage.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 rounded-2xl glass border border-theme-border/50 space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-theme-primary-light/40 flex items-center justify-center">
            <Compass className="w-6 h-6 text-brand-gold" />
          </div>
          <h4 className="text-lg font-bold text-white">Our Mission</h4>
          <p className="text-theme-muted text-sm leading-relaxed">
            To equip students with modern academic skills, research capabilities, and career tools. We aim to nurture socially responsible citizens through structured academic curricula and active co-curricular engagements.
          </p>
        </motion.div>

        {/* Motto */}
        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 rounded-2xl glass border border-theme-border/50 space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-theme-primary-light/40 flex items-center justify-center">
            <Award className="w-6 h-6 text-brand-gold" />
          </div>
          <h4 className="text-lg font-bold text-white">Our Motto</h4>
          <p className="text-theme-muted text-sm leading-relaxed font-serif italic text-white text-base">
            "Knowledge is Power"
          </p>
          <p className="text-theme-muted text-sm leading-relaxed">
            We hold that learning is the ultimate catalyst for progress, enabling individuals to conquer hurdles, innovate solutions, and elevate their society.
          </p>
        </motion.div>
      </section>

      {/* Message from Principal */}
      <section className="glass rounded-3xl overflow-hidden border border-theme-border/60 flex flex-col lg:flex-row shadow-xl">
        {/* Placeholder image container */}
        <div className="lg:w-1/3 bg-gradient-to-br from-theme-primary/40 to-brand-gold/20 flex flex-col items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-theme-border/50">
          <div className="w-32 h-32 rounded-full border-4 border-brand-gold flex items-center justify-center bg-theme-primary/50 overflow-hidden shadow-xl mb-4">
            <Users className="w-16 h-16 text-brand-gold" />
          </div>
          <h4 className="text-white font-bold text-lg">Prof. Dr. Muhammad Zahid</h4>
          <span className="text-xs text-brand-gold font-medium uppercase tracking-wider">Principal, GCJ Jhang</span>
          <p className="text-[10px] text-theme-muted mt-2">Ph.D. in Physics | 25+ Years Experience</p>
        </div>

        {/* Message Content */}
        <div className="lg:w-2/3 p-8 sm:p-12 space-y-4 flex flex-col justify-center">
          <span className="text-xs text-brand-gold font-bold uppercase tracking-wider">Leadership Message</span>
          <h3 className="text-2xl font-serif font-bold text-white leading-tight">Welcome from the Principal</h3>
          <div className="text-theme-muted text-sm leading-relaxed space-y-4">
            <p>
              "For 100 years, Government College Jhang has stood tall as an educational fortress, nurturing talent and guiding students towards civic duty and academic success. We believe in providing an inclusive learning ecosystem where science, technology, literature, and arts thrive side-by-side."
            </p>
            <p>
              "As we adapt to the digital age, we have upgraded our campus with robust computing networks, smart science laboratories, and integrated artificial intelligence platforms to support student advisory services. We welcome you to GCJ Jhang, where we turn aspirations into academic accomplishments."
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
