import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, AlertTriangle, ArrowLeft, Volume2, Mic } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

const INITIAL_CHAT = [
  { id: 1, from: 'bot', text: "Namaste! 🌾 I'm your Agri-Assistant. I can help with crop quality, market prices, or technical support. How can I assist you today?" }
];

export function Support({ setCurrentTab }) {
  const { user } = useAuth();
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

      if (textLower.includes('fraud') || textLower.includes('help') || textLower.includes('human') || textLower.includes('complaint')) {
        responseText = "I understand. I am connecting you to our Priority Support desk immediately. You can reach our senior expert at adityasinghvoid0009@gmail.com.";
        escalation = true;
      } else if (textLower.includes('price') || textLower.includes('mandi') || textLower.includes('rate')) {
        responseText = "Market prices are currently fluctuating. Use the Sensor to verify your crop's quality for better negotiation.";
      } else {
        responseText = "I'm here to help with any customer care needs! You can ask me about scanning, market prices, or profile settings.";
      }

      setMessages(prev => [...prev, { id: Date.now(), from: 'bot', text: responseText }]);
      speak(responseText);
      if (escalation) setShowExpert(true);
    }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-white font-body">
      <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={() => setCurrentTab('profile')} className="p-2 text-[#1A1A40]">
          <ArrowLeft size={24} />
        </button>
        <div className="w-12 h-12 rounded-xl bg-[#0056B3] flex items-center justify-center text-2xl text-white">🤖</div>
        <div>
          <h2 className="text-[#1A1A40] font-black text-lg leading-tight">Agri-Assistant</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#008C45] animate-pulse" />
            <span className="text-[10px] text-[#008C45] font-black uppercase tracking-widest">Active Audit</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-[20px] text-lg font-bold ${
              msg.from === 'user' 
                ? 'bg-[#0056B3] text-white rounded-br-sm shadow-xl shadow-[#0056B3]/10' 
                : 'bg-gray-50 border border-gray-100 text-[#1A1A40] rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-[20px] rounded-bl-sm flex gap-2">
              {[0,1,2].map(i => (
                <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: i*0.2 }} className="w-2 h-2 bg-[#0056B3] rounded-full" />
              ))}
            </div>
          </div>
        )}

        {showExpert && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#FF6F61]/5 border border-[#FF6F61]/20 p-6 rounded-[24px] mt-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-[#FF6F61]" size={24} />
              <div className="text-[#FF6F61] font-black text-lg">Priority Support</div>
            </div>
            <button className="w-full bg-white border-2 border-gray-100 p-4 rounded-[16px] flex items-center justify-between mb-3 shadow-sm active:scale-95 transition-transform">
              <div className="flex items-center gap-4">
                <Phone className="text-[#008C45]" size={20} />
                <div className="text-left">
                  <div className="text-sm text-[#1A1A40] font-black">Aditya Singh</div>
                  <div className="text-xs text-gray-400">+91 96749 51947</div>
                </div>
              </div>
              <span className="text-[10px] bg-[#008C45] text-white px-3 py-1.5 rounded-[8px] font-black uppercase tracking-widest">Call</span>
            </button>
            <button className="w-full bg-white border-2 border-gray-100 p-4 rounded-[16px] flex items-center justify-between shadow-sm active:scale-95 transition-transform">
              <div className="flex items-center gap-4">
                <Mail className="text-[#0056B3]" size={20} />
                <div className="text-left">
                  <div className="text-sm text-[#1A1A40] font-black">Email Help</div>
                  <div className="text-xs text-gray-400">adityasinghvoid0009@gmail.com</div>
                </div>
              </div>
              <span className="text-[10px] bg-[#0056B3] text-white px-3 py-1.5 rounded-[8px] font-black uppercase tracking-widest">Email</span>
            </button>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-6 border-t border-gray-100 bg-white pb-24">
        <div className="flex gap-3">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-[16px] px-5 py-4 text-lg text-[#1A1A40] font-bold focus:border-[#0056B3] outline-none transition-colors placeholder:opacity-30"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-16 h-16 rounded-[16px] bg-[#0056B3] flex items-center justify-center text-white shadow-xl shadow-[#0056B3]/20 disabled:opacity-30 shrink-0 transition-transform active:scale-95"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
