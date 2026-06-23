import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { api } from '../utils/api';

const initialMessages = [
  { sender: 'bot', text: "Welcome to Government College Jhang! I am your AI Advisor, powered by Google Gemini. Ask me anything about our admissions, fee structures, courses, and faculty." }
];

const quickPrompts = [
  "Admissions schedule?",
  "BS Computer Science eligibility?",
  "Semester tuition fees?",
  "What is the merit formula?"
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const result = await api.askAdvisor(text);
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: 'bot', text: result.response }]);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev, 
        { sender: 'bot', text: "I apologize, but I ran into a connection glitch. Please check your network or try again." }
      ]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-[90vw] sm:w-[380px] h-[500px] rounded-3xl glass border border-theme-border/60 flex flex-col overflow-hidden mb-4 shadow-2xl"
          >
            {/* Header */}
            <div className="bg-navy-gold-grad px-5 py-4 border-b border-theme-border flex items-center justify-between text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center shadow-md shadow-brand-gold/15">
                  <Sparkles className="w-5 h-5 text-[#0b132b]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">GCJ Academic AI Advisor</h4>
                  <span className="text-[10px] text-brand-gold font-medium tracking-wider uppercase">
                    Always Online
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 scroll-smooth text-left">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-theme-primary text-white rounded-br-none shadow shadow-theme-primary/10'
                        : 'bg-theme-primary-light/40 border border-theme-border/50 text-theme-text rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-theme-primary-light/40 border border-theme-border/50 text-theme-muted p-3.5 rounded-2xl rounded-bl-none flex items-center space-x-1.5">
                    <div className="flex space-x-1">
                      <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-4 py-2 border-t border-theme-border bg-theme-primary-light/10 flex flex-wrap gap-1.5 justify-start">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[10px] bg-theme-primary-light/40 hover:bg-theme-primary text-theme-muted hover:text-white border border-theme-border hover:border-theme-primary px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Form Input */}
            <form 
              onSubmit={handleFormSubmit}
              className="p-3 bg-theme-navbar border-t border-theme-border flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about GCJ admissions, fees, HODs..."
                className="flex-grow bg-theme-primary-light/10 border border-theme-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl py-2 px-3.5 text-xs text-theme-text outline-none transition-all placeholder:text-theme-light"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white shadow shadow-theme-primary/10 transition-colors flex-shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Bubble Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-theme-primary to-brand-gold text-white flex items-center justify-center shadow-xl shadow-theme-primary/25 cursor-pointer relative"
        aria-label="Open AI advisor chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-theme-bg">
                1
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
