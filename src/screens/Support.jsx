import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, AlertTriangle, ArrowLeft, Volume2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

const INITIAL_CHAT = [
  { id: 1, from: 'bot', text: "Greetings. 🌾 I am the Agri-Compliance Assistant. I can assist with audit queries, quality benchmarks, or technical support. How may I help?" }
];

export function Support({ setCurrentTab }) {
  const { speak } = useLang();
  const [messages, setMessages] = useState(INITIAL_CHAT);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showExpert, setShowExpert] = useState(false);
  const bottomRef = useRef(null);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => scrollToBottom(), [messages, isTyping, showExpert]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const textLower = userText.toLowerCase();
      let responseText = "";
      let escalation = false;

      if (textLower.includes('help') || textLower.includes('human') || textLower.includes('complaint')) {
        responseText = "Understood. Connecting you to our Senior Compliance Expert at adityasinghvoid0009@gmail.com.";
        escalation = true;
      } else {
        responseText = "I am ready to assist with any technical or compliance queries. For urgent escalations, please type 'help'.";
      }

      setMessages(prev => [...prev, { id: Date.now(), from: 'bot', text: responseText }]);
      speak(responseText);
      if (escalation) setShowExpert(true);
    }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-white font-body">
      <div className="p-8 border-b border-[#1E5128]/5 flex items-center gap-5 bg-white sticky top-0 z-10">
        <button onClick={() => setCurrentTab('profile')} className="p-2 text-[#1E5128]">
          <ArrowLeft size={24} />
        </button>
        <div className="w-12 h-12 rounded-[16px] bg-[#1E6F6B] flex items-center justify-center text-2xl text-white shadow-lg shadow-[#1E6F6B]/20">🤖</div>
        <div>
          <h2 className="text-[#1E5128] font-black text-lg leading-tight">Agri-Assistant</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#1E5128] animate-pulse" />
            <span className="text-[10px] text-[#1E5128] font-black uppercase tracking-widest opacity-60">System Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-[24px] text-lg font-bold ${
              msg.from === 'user' 
                ? 'bg-[#1E6F6B] text-white rounded-br-sm shadow-xl shadow-[#1E6F6B]/10' 
                : 'bg-[#F1F8F4] border border-[#1E5128]/5 text-[#2D2D2D] rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#F1F8F4] border border-[#1E5128]/5 p-4 rounded-[20px] rounded-bl-sm flex gap-2">
              {[0,1,2].map(i => (
                <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: i*0.2 }} className="w-2.5 h-2.5 bg-[#1E6F6B] rounded-full" />
              ))}
            </div>
          </div>
        )}

        {showExpert && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#F1F8F4] border border-[#1E5128]/10 p-8 rounded-[32px] mt-8">
            <div className="flex items-center gap-4 mb-6">
              <AlertTriangle className="text-[#1E5128]" size={28} />
              <div className="text-[#1E5128] font-black text-xl uppercase tracking-widest">Expert Access</div>
            </div>
            <button className="w-full bg-white border border-[#1E5128]/5 p-5 rounded-[20px] flex items-center justify-between mb-4 shadow-sm active:scale-95 transition-all">
              <div className="flex items-center gap-5">
                <Phone className="text-[#1E5128]" size={22} />
                <div className="text-left">
                  <div className="text-sm text-[#1E5128] font-black uppercase">Aditya Singh</div>
                  <div className="text-xs text-[#2D2D2D] opacity-40">+91 96749 51947</div>
                </div>
              </div>
              <span className="text-[10px] bg-[#1E5128] text-white px-4 py-2 rounded-[10px] font-black uppercase tracking-widest">Call</span>
            </button>
            <button className="w-full bg-white border border-[#1E5128]/5 p-5 rounded-[20px] flex items-center justify-between shadow-sm active:scale-95 transition-all">
              <div className="flex items-center gap-5">
                <Mail className="text-[#1E6F6B]" size={22} />
                <div className="text-left">
                  <div className="text-sm text-[#1E5128] font-black uppercase">Priority Email</div>
                  <div className="text-xs text-[#2D2D2D] opacity-40">adityasinghvoid0009@gmail.com</div>
                </div>
              </div>
              <span className="text-[10px] bg-[#1E6F6B] text-white px-4 py-2 rounded-[10px] font-black uppercase tracking-widest">Email</span>
            </button>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-8 border-t border-[#1E5128]/5 bg-white pb-32">
        <div className="flex gap-4">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Audit query..."
            className="flex-1 bg-[#F1F8F4] border border-[#1E5128]/10 rounded-[20px] px-6 py-5 text-lg text-[#1A1A40] font-bold focus:border-[#1E6F6B] outline-none transition-all placeholder:opacity-20"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-18 h-18 w-[72px] h-[72px] rounded-[20px] bg-[#1E6F6B] flex items-center justify-center text-white shadow-xl shadow-[#1E6F6B]/30 disabled:opacity-30 shrink-0 active:scale-90 transition-all"
          >
            <Send size={28} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
