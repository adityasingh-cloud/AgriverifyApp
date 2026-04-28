import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, TrendingUp, Globe, Volume2, Search, ExternalLink } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

const CATEGORIES = [
  { id: 'all', icon: Newspaper, key: 'cat_all', query: 'agriculture india' },
  { id: 'subsidies', icon: TrendingUp, key: 'cat_subsidies', query: 'farmer subsidies india' },
  { id: 'market', icon: TrendingUp, key: 'cat_market', query: 'crop mandi prices' },
  { id: 'tech', icon: Globe, key: 'cat_tech', query: 'agriculture technology' },
];

export function News() {
  const { t, speak } = useLang();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchLiveNews = async () => {
      setLoading(true);
      const catQuery = CATEGORIES.find(c => c.id === activeCategory)?.query || 'agriculture india';
      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      
      try {
        if (!apiKey || apiKey === 'YOUR_NEWS_API_KEY') throw new Error("No Key");
        const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(catQuery)}&sortBy=publishedAt&pageSize=15&apiKey=${apiKey}`);
        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        
        if (isMounted && data.articles) {
          const formatted = data.articles.map((article, index) => ({
            id: `api-${index}`,
            source: article.source.name || 'AgriNews',
            time: new Date(article.publishedAt).toLocaleDateString(),
            content: article.title,
            url: article.url,
            readTime: '3m read',
            isBreaking: index === 0
          }));
          setNewsData(formatted);
        }
      } catch (err) {
        const mockApiData = [
          { id: 1, source: 'Reuters Agri', time: '10m ago', content: 'Global fertilizer supply chain stabilizes for the current harvest cycle.', url: '#', readTime: '2m read', isBreaking: true },
          { id: 2, source: 'DD Kisan', time: '1h ago', content: 'New PM-Kisan subsidy installments update released for active farmers.', url: '#', readTime: '1m read', isBreaking: false },
          { id: 3, source: 'Times of India', time: '3h ago', content: 'Wheat price projections indicate stability in Northern Mandis.', url: '#', readTime: '3m read', isBreaking: false },
        ];
        if (isMounted) setNewsData(mockApiData);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchLiveNews();
    return () => { isMounted = false; };
  }, [activeCategory]);

  const filteredNews = newsData.filter(n => !searchQuery || n.content.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleListen = () => {
    const breaking = newsData.find(n => n.isBreaking);
    if (breaking) speak(`${t('breaking_news_alert')}: ${breaking.content}`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col bg-white min-h-full font-body">
      <div className="p-8 pb-4 border-b border-[#1E5128]/5 sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-black text-[#1E5128]">{t('news_hub')}</h1>
          <button onClick={handleListen} disabled={loading} className="flex items-center gap-2 bg-[#1E6F6B] text-white px-5 py-2 rounded-[14px] text-xs font-black shadow-lg shadow-[#1E6F6B]/20">
            <Volume2 size={16} /> {t('listen')}
          </button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1E5128]/30" size={20} />
          <input 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('search_news')}
            className="w-full bg-[#F1F8F4] border border-[#1E5128]/10 rounded-[20px] py-4 pl-14 pr-4 text-sm text-[#2D2D2D] font-bold focus:ring-2 focus:ring-[#1E6F6B]/10 outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-[16px] text-xs font-black whitespace-nowrap transition-all ${
                activeCategory === cat.id ? 'bg-[#1E5128] text-white shadow-lg' : 'bg-[#F1F8F4] text-[#1E5128] border border-[#1E5128]/5'
              }`}
            >
              <cat.icon size={16} />
              {t(cat.key)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6 pb-32">
        {loading ? (
           <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#1E6F6B] border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : filteredNews.length > 0 ? filteredNews.map((news) => (
          <div key={news.id} className="bg-white border border-[#1E5128]/10 rounded-[28px] p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-[#F1F8F4] rounded-[12px]">
                <Newspaper size={18} className="text-[#1E5128]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#1E5128] uppercase tracking-[0.15em]">{news.source}</span>
                <span className="text-[10px] text-[#2D2D2D] opacity-40 font-bold">{news.time}</span>
              </div>
            </div>
            <div className="text-lg font-black text-[#2D2D2D] mb-5 leading-tight">{news.content}</div>
            <div className="flex justify-between items-center pt-5 border-t border-[#1E5128]/5">
              <span className="text-[10px] text-[#2D2D2D] opacity-30 font-black uppercase tracking-widest">{news.readTime}</span>
              <a href={news.url} target="_blank" rel="noopener noreferrer" className="bg-[#1E6F6B] text-white text-[10px] font-black px-5 py-2.5 rounded-[12px] flex items-center gap-2 shadow-sm">
                {t('read_more')} <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )) : (
          <div className="text-center text-[#2D2D2D] opacity-20 font-black text-sm mt-10">No articles.</div>
        )}
      </div>
    </motion.div>
  );
}
