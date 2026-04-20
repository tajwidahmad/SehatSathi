import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, User, Send, AlertTriangle, Activity, BriefcaseMedical } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyA3BrxRFUcp7WbQNCq6zyHDoaswJQYYp24");

const SymptomChecker = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am your AI Health Assistant. Please describe your symptoms in detail, and I'll provide preliminary guidance and suggest the type of specialist you should see.",
      isAction: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are an AI-assisted healthcare triage bot. A user is describing their symptoms: "${userMessage}".
      
      Respond in short, friendly, and structured format. 
      Your goals:
      1. Analyze the symptoms.
      2. Suggest 2-3 possible generic issues.
      3. Recommend ONE specific type of doctor they should see (MUST be one of: General physician, Gynecologist, Dermatologist, Pediatricians, Neurologist, Gastroenterologist).
      4. End with a disclaimer that you are not a doctor.
      
      Do NOT write a massive essay. Keep it under 150 words. Format with emojis.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Extract recommended doctor type if possible
      const specs = ['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'];
      let suggestedSpec = null;
      for (const spec of specs) {
          if (responseText.toLowerCase().includes(spec.toLowerCase())) {
              suggestedSpec = spec;
              break;
          }
      }

      setMessages(prev => [
        ...prev, 
        { 
            id: Date.now() + 1, 
            sender: 'bot', 
            text: responseText,
            actionSpec: suggestedSpec
        }
      ]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: "I'm sorry, I'm having trouble connecting right now. Please seek a General physician if your symptoms are concerning." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col h-[calc(100vh-100px)]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6">
          <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <Activity className="w-8 h-8 text-primary" />
                  AI Symptom Checker
              </h1>
              <p className="text-gray-600 mt-2">Get AI-assisted preliminary healthcare guidance based on your symptoms.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-200">
             <AlertTriangle className="w-5 h-5 flex-shrink-0" />
             <p className="text-xs font-semibold leading-tight">Not a medical diagnosis.<br/>Always consult a qualified doctor.</p>
          </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6 flex flex-col gap-4 shadow-inner">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white border border-gray-200'}`}>
               {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-6 h-6 text-primary" />}
            </div>
            
            <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[70%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl text-sm md:text-base leading-relaxed ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm'}`}>
                    {msg.text.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))}
                </div>

                {/* Optional Action Button if AI detected a specialty */}
                {msg.sender === 'bot' && msg.actionSpec && (
                    <button 
                       onClick={() => { navigate(`/doctors/${msg.actionSpec}`); scrollTo(0,0); }}
                       className="mt-1 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white px-5 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-all shadow-sm"
                    >
                        <BriefcaseMedical className="w-4 h-4" />
                        Find {msg.actionSpec}
                    </button>
                )}
            </div>
          </motion.div>
        ))}

        {isLoading && (
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-md">
                   <Bot className="w-6 h-6 text-primary animate-pulse" />
               </div>
               <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm rounded-tl-sm flex items-center gap-2">
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s'}}></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s'}}></div>
               </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="mt-4 flex items-center gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="E.g., I have a severe headache and blurred vision..."
          className="flex-1 bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-full px-6 py-4 outline-none text-base shadow-sm transition-all text-gray-800"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="bg-primary hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-4 rounded-full shadow-lg transition-transform active:scale-95"
        >
           <Send className="w-5 h-5 fill-white" />
        </button>
      </form>
    </div>
  );
};

export default SymptomChecker;
