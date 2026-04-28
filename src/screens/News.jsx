import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, MessageSquare, TrendingUp, Globe, Volume2, Search, ExternalLink } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

const CATEGORIES = [
  { id: 'all', icon: Newspaper, key: 'cat_all' },
  { id: 'subsidies', icon: TrendingUp, key: 'cat_subsidies' },
  { id: 'market', icon: TrendingUp, key: 'cat_market' },
  { id: 'tech', icon: Globe, key: 'cat_tech' },
];

const MOCK_NEWS = [
  { id: 1, source: 'X (Gov)', author: '@AgriMinIndia', type: 'subsidies', time: '10m ago', content: 'New PM-Kisan subsidy installments will be released next week. Update your KYC to ensure seamless transfer.', readTime: '1m read', isBreaking: true },
  { id: 2, source: 'Google News', author: 'Economic Times', type: 'market', time: '1h ago', content: 'Wheat prices surge in Northern Mandis due to unseasonal rain forecasts. Farmers advised to harvest early.', readTime: '3m read', isBreaking: false },
  { id: 3, source: 'AgriTech Weekly', author: 'TechDesk', type: 'tech', time: '3h ago', content: 'New Drone-as-a-Service launched in Maharashtra for targeted pesticide spraying, cutting costs by 40%.', readTime: '5m read', isBreaking: false },
  { id: 4, source: 'X (Global)', author: '@FAO', type: 'global', time: '5h ago', content: 'Global fertilizer supply chain stabilizes, bringing down prices for urea and DAP by 15% this quarter.', readTime: '2m read', isBreaking: false },
];

export function News() {
  const { t, speak, lang } = useLang();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = MOCK_NEWS.filter(n => {
    if (activeCategory !== 'all' && n.type !== activeCategory && n.type !== 'global') return false;
    if (searchQuery && !n.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleListen = () => {
    const breaking = MOCK_NEWS.find(n => n.isBreaking);
    if (breaking) {
      speak(`${t('breaking_news_alert')}: ${breaking.content}`);
    } else {
      speak(t('no_breaking_news'));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-agri-bg">
      <div className="p-6 pb-2 border-b border-agri-border sticky top-0 bg-agri-bg/90 backdrop-blur-md z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-display font-black text-white">{t('news_hub')}</h1>
          <button onClick={handleListen} className="flex items-center gap-2 bg-agri-green/10 text-agri-green px-3 py-1.5 rounded-full text-xs font-bold border border-agri-green/30">
            <Volume2 size={14} /> {t('listen')}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('search_news')}
            className="w-full bg-agri-card border border-agri-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-agri-green outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat.id ? 'bg-agri-green text-black' : 'bg-agri-card text-gray-400 border border-agri-border'
              }`}
            >
              <cat.icon size={14} />
              {t(cat.key)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4 pb-12 overflow-y-auto">
        {filteredNews.map((news) => (
          <div key={news.id} className="bg-agri-card border border-agri-border rounded-2xl p-4 overflow-hidden relative">
            {news.isBreaking && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-xl uppercase tracking-wider">
                {t('breaking')}
              </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              {news.source.includes('X') ? <MessageSquare size={14} className="text-blue-400" /> : <Newspaper size={14} className="text-agri-green" />}
              <span className="text-[10px] font-bold text-gray-400 uppercase">{news.source}</span>
              <span className="text-[10px] text-gray-600">• {news.time}</span>
            </div>
            <div className="text-sm font-bold text-white mb-1">{news.author}</div>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">{news.content}</p>
            <div className="flex justify-between items-center border-t border-white/5 pt-3">
              <span className="text-[10px] text-gray-500 font-semibold">{news.readTime}</span>
              <button className="text-xs text-agri-green font-bold flex items-center gap-1">
                {t('read_more')} <ExternalLink size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
