import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const INITIAL_CHAT = [
  { id: 1, from: 'bot', text: "Namaste! 🌾 I'm AgriBot. I can help with crop quality, market prices, or technical support. How can I assist you today?" }
];

export function Support({ setCurrentTab }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState(INITIAL_CHAT);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showExpert, setShowExpert] = useState(false);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showExpert]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const textLower = userText.toLowerCase();
      // Keyword detection for escalation
      if (textLower.includes('fraud') || textLower.includes('help') || textLower.includes('human')) {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          from: 'bot', 
          text: "I detect this is a serious matter. I am connecting you to a Learvon Human Expert immediately." 
        }]);
        setShowExpert(true);
      } else {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          from: 'bot', 
          text: "Based on our data, current mandi rates are stable. Try scanning your crop for a precise AI evaluation." 
        }]);
      }
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-agri-bg">
      <div className="p-4 border-b border-agri-border flex items-center gap-3 bg-agri-card/50 backdrop-blur-md sticky top-0 z-10">
        <button onClick={() => setCurrentTab('profile')} className="p-2 text-gray-400 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <div className="w-10 h-10 rounded-xl bg-agri-green/20 flex items-center justify-center text-xl">🤖</div>
        <div>
          <h2 className="text-white font-bold text-sm">Hybrid AI Support</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-agri-green animate-pulse" />
            <span className="text-[10px] text-agri-green font-semibold">Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.from === 'user' 
                ? 'bg-gradient-to-br from-agri-green to-agri-green-dim text-white rounded-br-sm shadow-[0_4px_15px_rgba(34,197,94,0.2)]' 
                : 'bg-agri-card border border-agri-border text-gray-200 rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-agri-card border border-agri-border p-3 rounded-2xl rounded-bl-sm flex gap-1.5">
              {[0,1,2].map(i => (
                <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: i*0.2 }} className="w-1.5 h-1.5 bg-agri-green rounded-full" />
              ))}
            </div>
          </div>
        )}

        {showExpert && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl mt-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-400" size={20} />
              <div className="text-red-400 font-bold text-sm">Connect to Learvon Expert</div>
            </div>
            <button className="w-full bg-agri-card hover:bg-agri-card2 border border-agri-border p-3 rounded-xl flex items-center justify-between mb-2 transition-colors">
              <div className="flex items-center gap-3">
                <Phone className="text-agri-green" size={16} />
                <div className="text-left">
                  <div className="text-xs text-white font-bold">Aditya Singh</div>
                  <div className="text-[10px] text-gray-400">+91 96749 51947</div>
                </div>
              </div>
              <span className="text-[10px] bg-agri-green/20 text-agri-green px-2 py-1 rounded-md font-bold">Call</span>
            </button>
            <button className="w-full bg-agri-card hover:bg-agri-card2 border border-agri-border p-3 rounded-xl flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="text-blue-400" size={16} />
                <div className="text-left">
                  <div className="text-xs text-white font-bold">Priority Email Support</div>
                  <div className="text-[10px] text-gray-400">adityasinghvoid0009@gmail.com</div>
                </div>
              </div>
              <span className="text-[10px] bg-blue-400/20 text-blue-400 px-2 py-1 rounded-md font-bold">Email</span>
            </button>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-agri-border bg-agri-bg">
        <div className="flex gap-2">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-agri-card border border-agri-border rounded-xl px-4 text-sm text-white focus:border-agri-green outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-xl bg-agri-green flex items-center justify-center text-black disabled:opacity-50 shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
