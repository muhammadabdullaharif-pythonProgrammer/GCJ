import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, X, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { api } from '../utils/api';

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [filteredGallery, setFilteredGallery] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  
  // Lightbox Slide Index State
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    async function loadGalleryData() {
      const data = await api.getGallery();
      setGallery(data);
      setFilteredGallery(data);
    }
    loadGalleryData();
  }, []);

  useEffect(() => {
    if (activeCategory === 'ALL') {
      setFilteredGallery(gallery);
    } else {
      setFilteredGallery(gallery.filter(item => item.category.toUpperCase() === activeCategory));
    }
    setLightboxIndex(null); // Clear lightbox on filter change
  }, [activeCategory, gallery]);

  // Navigate lightbox slider
  const handlePrevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? filteredGallery.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === filteredGallery.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev === 0 ? filteredGallery.length - 1 : prev - 1));
      if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev === filteredGallery.length - 1 ? 0 : prev + 1));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredGallery]);

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
          Campus Gallery
        </h2>
        <span className="text-xs sm:text-sm text-brand-gold font-semibold uppercase tracking-widest">
          Visions of Student Life, Laboratories, & Athletics
        </span>
        <p className="text-theme-muted text-sm sm:text-base max-w-2xl leading-relaxed text-center">
          Browse through high-resolution captures of Government College Jhang's historical clocktower premises, engineering labs, and sports competitions.
        </p>
      </section>

      {/* Category Selection Tabs */}
      <section className="flex flex-wrap gap-2 justify-center bg-theme-primary-light/10 p-1.5 rounded-2xl border border-theme-border/40 w-max mx-auto">
        {[
          { label: 'Show All', value: 'ALL' },
          { label: 'Campus grounds', value: 'CAMPUS' },
          { label: 'Research Labs', value: 'LABS' },
          { label: 'Class Academics', value: 'ACADEMICS' },
          { label: 'Sports Gala', value: 'SPORTS' },
          { label: 'College Events', value: 'EVENTS' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveCategory(tab.value)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeCategory === tab.value
                ? 'bg-theme-primary text-white border border-theme-primary shadow shadow-theme-primary/20'
                : 'text-theme-muted hover:text-theme-text hover:bg-theme-primary-light/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {/* masonry photogrid */}
      <section className="min-h-[400px]">
        {filteredGallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGallery.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightboxIndex(index)}
                className="relative rounded-2xl overflow-hidden group cursor-pointer glass border border-theme-border/60 aspect-square shadow-md"
              >
                <img 
                  src={item.image_url} 
                  alt={item.caption} 
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Hover overlay description */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                  <span className="text-[9px] bg-brand-gold text-[#0b132b] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-max mb-2">
                    {item.category}
                  </span>
                  <p className="text-white text-xs font-bold leading-snug line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass border border-theme-border/60 rounded-3xl">
            <Image className="w-12 h-12 text-theme-light mx-auto mb-3" />
            <p className="text-theme-muted text-sm font-semibold">No pictures uploaded under this category yet.</p>
          </div>
        )}
      </section>

      {/* Lightbox Modal Slider */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-sm select-none"
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer z-55"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Image Trigger */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all cursor-pointer z-55"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Active Image Box */}
            <div className="relative max-w-4xl w-full max-h-[70vh] flex items-center justify-center">
              <motion.img
                key={filteredGallery[lightboxIndex].id}
                src={filteredGallery[lightboxIndex].image_url}
                alt={filteredGallery[lightboxIndex].caption}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()} // Stop bubbling
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl border border-white/5"
              />
            </div>

            {/* Next Image Trigger */}
            <button
              onClick={handleNextImage}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all cursor-pointer z-55"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Caption Footer */}
            <div className="mt-6 text-center max-w-xl space-y-2 p-4">
              <span className="text-[10px] bg-brand-gold text-[#0b132b] font-bold uppercase tracking-wider px-3 py-1 rounded w-max mx-auto block">
                {filteredGallery[lightboxIndex].category}
              </span>
              <p className="text-white text-sm sm:text-base font-medium">
                {filteredGallery[lightboxIndex].caption}
              </p>
              <span className="text-xs text-gray-500">
                Photo {lightboxIndex + 1} of {filteredGallery.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
