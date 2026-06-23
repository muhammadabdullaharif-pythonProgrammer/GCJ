import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search, X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { api } from '../utils/api';

const ITEMS_PER_PAGE = 4;

export default function NewsEvents() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  
  // Selected Article Modal State
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    async function loadNews() {
      const data = await api.getNewsEvents();
      setNews(data);
      setFilteredNews(data);
    }
    loadNews();
  }, []);

  useEffect(() => {
    let result = news;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.body.toLowerCase().includes(query)
      );
    }

    setFilteredNews(result);
    setCurrentPage(1); // Reset page on query search
  }, [searchQuery, news]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: 'smooth' });
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
          News & Campus Events
        </h2>
        <span className="text-xs sm:text-sm text-brand-gold font-semibold uppercase tracking-widest">
          Announcements, Seminars, & Student Activities
        </span>
        <p className="text-theme-muted text-sm sm:text-base max-w-2xl leading-relaxed text-center">
          Stay informed about current updates, examinations timelines, convocation schedules, and research projects rolling out at Government College Jhang.
        </p>
      </section>

      {/* Search Header Bar */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">
          Feed Timeline ({filteredNews.length} Articles)
        </h3>
        
        {/* Search */}
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-theme-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news articles..."
            className="w-full bg-theme-primary-light/15 border border-theme-border/60 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl py-3 pl-11 pr-4 text-sm text-theme-text outline-none transition-all placeholder:text-theme-light"
          />
        </div>
      </section>

      {/* Feed List Grid */}
      <section className="min-h-[400px] space-y-6">
        {paginatedNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedNews.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -5 }}
                className="rounded-2xl overflow-hidden glass border border-theme-border/50 flex flex-col hover-gold-glow transition-all duration-300 shadow-lg"
              >
                {item.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-xs text-theme-light">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-brand-gold" />
                      <span>
                        {new Date(item.event_date || item.created_at).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <h4 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2 hover:text-brand-gold transition-colors">
                      {item.title}
                    </h4>
                    
                    <p className="text-theme-muted text-xs leading-relaxed line-clamp-4">
                      {item.body}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedArticle(item)}
                    className="w-max pt-2 text-brand-gold hover:text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass border border-theme-border/60 rounded-3xl">
            <BookOpen className="w-12 h-12 text-theme-light mx-auto mb-3" />
            <p className="text-theme-muted text-sm font-semibold">No news articles found matching queries.</p>
          </div>
        )}
      </section>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <section className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-theme-primary-light/45 hover:bg-theme-primary hover:text-white text-theme-text border border-theme-border/50 disabled:opacity-40 disabled:hover:bg-theme-primary-light/45 transition-colors cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                currentPage === page
                  ? 'bg-theme-primary text-white border-theme-primary shadow shadow-theme-primary/25'
                  : 'bg-theme-primary-light/10 hover:bg-theme-primary-light/40 text-theme-muted hover:text-theme-text border-theme-border/60'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-theme-primary-light/45 hover:bg-theme-primary hover:text-white text-theme-text border border-theme-border/50 disabled:opacity-40 disabled:hover:bg-theme-primary-light/45 transition-colors cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </section>
      )}

      {/* Pop-up Read More Lightbox Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-theme-footer border border-theme-border/80 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
            >
              {/* Image banner in modal */}
              {selectedArticle.image_url && (
                <div className="h-56 sm:h-64 overflow-hidden relative">
                  <img 
                    src={selectedArticle.image_url} 
                    alt={selectedArticle.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-theme-footer to-transparent" />
                </div>
              )}
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 hover:bg-black text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center text-xs text-brand-gold space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold">
                    {new Date(selectedArticle.event_date || selectedArticle.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {selectedArticle.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.body}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
