import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyA3BrxRFUcp7WbQNCq6zyHDoaswJQYYp24");

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi! I'm your SehatSathi AI Guide. Need help finding a doctor, checking symptoms, or navigating the platform?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check if the user is completely new and auto-pulse the bubble.
    const isReturning = localStorage.getItem('sehatsathi_returning_user');
    if (!isReturning) {
        localStorage.setItem('sehatsathi_returning_user', 'true');
        // Automatically open the chat after 3 seconds for new users to greet them
        setTimeout(() => {
            if (!hasOpenedBefore) {
                setIsOpen(true);
                setHasOpenedBefore(true);
            }
        }, 3000);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
        setHasOpenedBefore(true);
        scrollToBottom();
    }
  }, [isOpen, messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const promptContext = `You are the SehatSathi AI Assistant, a friendly and helpful onboarding guide embedded in the SehatSathi healthcare website. SehatSathi provides Doctor Bookings, AI Symptom Checking, and Medicine Reminders. 
      The user just said: "${userMessage}".
      Respond in a brief, super friendly, and engaging conversational way (under 60 words). Use emojis. Guide them to use our platform features. Remember, do not give specific medical diagnoses, just guide them to features or doctors.`;

      const result = await model.generateContent(promptContext);
      const responseText = result.response.text();

      setMessages(prev => [
        ...prev, 
        { 
            id: Date.now() + 1, 
            sender: 'bot', 
            text: responseText
        }
      ]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: "I'm having a little trouble connecting right now, but feel free to explore our 'All Doctors' section!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (Bottom Left since SOS is Bottom Right) */}
      <AnimatePresence>
          {!isOpen && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 md:left-8 md:bottom-8 w-14 h-14 bg-gradient-to-tr from-primary to-blue-500 rounded-full shadow-2xl flex items-center justify-center z-50 text-white border-2 border-white cursor-pointer group"
              >
                  {/* Subtle new user ping if they haven't opened it */}
                  {!hasOpenedBefore && <div className="absolute inset-0 rounded-full border-4 border-primary/50 animate-ping"></div>}
                  <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <div className="absolute -top-1 -right-1 bg-yellow-400 p-0.5 rounded-full shadow-sm">
                      <Sparkles className="w-3 h-3 text-yellow-900" />
                  </div>
              </motion.button>
          )}
      </AnimatePresence>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-6 left-6 md:left-8 md:bottom-8 w-[90vw] sm:w-[350px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-[100] border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-blue-600 p-4 flex items-center justify-between text-white shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="flex items-center gap-3 relative z-10">
                      <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                          <Bot className="w-5 h-5 fill-white text-white" />
                      </div>
                      <div>
                          <h3 className="font-bold leading-tight flex items-center gap-1">SehatSathi AI <Sparkles className="w-3 h-3 text-yellow-300"/></h3>
                          <p className="text-[10px] text-blue-100 font-medium tracking-wider uppercase">Onboarding Guide</p>
                      </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors relative z-10 shrink-0">
                      <X className="w-5 h-5" />
                  </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 flex flex-col gap-3">
                  {messages.map((msg) => (
                      <div key={msg.id} className={`flex max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'} gap-2`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-gray-200' : 'bg-primary/10'}`}>
                              {msg.sender === 'user' ? <User className="w-4 h-4 text-gray-600" /> : <Bot className="w-4 h-4 text-primary" />}
                          </div>
                          <div className={`px-3 py-2 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-sm'}`}>
                             {msg.text}
                          </div>
                      </div>
                  ))}
                  
                  {isLoading && (
                      <div className="flex max-w-[85%] self-start gap-2">
                           <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10">
                              <Bot className="w-4 h-4 text-primary animate-pulse" />
                           </div>
                           <div className="px-4 py-3 bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s'}}></div>
                               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s'}}></div>
                           </div>
                      </div>
                  )}
                  <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 shrink-0">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                      <input 
                         type="text" 
                         value={input}
                         onChange={(e) => setInput(e.target.value)}
                         placeholder="Ask me anything..."
                         className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400"
                      />
                      <button type="submit" disabled={!input.trim() || isLoading} className="p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shrink-0">
                          <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
                      </button>
                  </div>
              </form>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
