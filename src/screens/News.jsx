import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, MessageSquare, TrendingUp, Globe, Volume2, Search, ExternalLink } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

const CATEGORIES = [
  { id: 'all', icon: Newspaper, key: 'cat_all', query: 'agriculture india', color: '#0056B3' },
  { id: 'subsidies', icon: TrendingUp, key: 'cat_subsidies', query: 'farmer subsidies india', color: '#008C45' },
  { id: 'market', icon: TrendingUp, key: 'cat_market', query: 'crop mandi prices', color: '#FFBF00' },
  { id: 'tech', icon: Globe, key: 'cat_tech', query: 'agriculture technology', color: '#1A1A40' },
];

export function News() {
  const { t, speak, lang } = useLang();
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
        if (!apiKey || apiKey === 'YOUR_NEWS_API_KEY') throw new Error("Missing API Key");
        const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(catQuery)}&sortBy=publishedAt&pageSize=15&apiKey=${apiKey}`);
        if (!response.ok) throw new Error("API Limit");
        const data = await response.json();
        
        if (isMounted && data.articles && data.articles.length > 0) {
          const formatted = data.articles.map((article, index) => ({
            id: `api-${index}`,
            source: article.source.name || 'AgriNews',
            type: activeCategory,
            time: new Date(article.publishedAt).toLocaleDateString(),
            content: article.title,
            description: article.description,
            url: article.url,
            readTime: '3m read',
            isBreaking: index === 0
          }));
          setNewsData(formatted);
        } else {
          throw new Error("No articles");
        }
      } catch (err) {
        const mockApiData = [
          { id: 1, source: 'Reuters Agri', type: 'tech', time: '10m ago', content: 'Global fertilizer supply chain stabilizes, bringing down prices for urea and DAP.', url: '#', readTime: '2m read', isBreaking: true, color: '#0056B3' },
          { id: 2, source: 'DD Kisan', type: 'subsidies', time: '1h ago', content: 'New PM-Kisan subsidy installments will be released next week. Update your KYC.', url: '#', readTime: '1m read', isBreaking: false, color: '#008C45' },
          { id: 3, source: 'Times of India', type: 'market', time: '3h ago', content: 'Wheat prices surge in Northern Mandis due to unseasonal rain forecasts.', url: '#', readTime: '3m read', isBreaking: false, color: '#FFBF00' },
          { id: 4, source: 'AgriTech Weekly', type: 'tech', time: '5h ago', content: 'New Drone-as-a-Service launched in Maharashtra for targeted pesticide spraying.', url: '#', readTime: '5m read', isBreaking: false, color: '#1A1A40' },
          { id: 5, source: 'Mandi Bureau', type: 'market', time: '6h ago', content: 'Rice export restrictions partially lifted; Indian Basmati prices expected to stabilize.', url: '#', readTime: '4m read', isBreaking: false, color: '#FFBF00' },
        ];
        if (isMounted) {
          const categoryFilter = activeCategory === 'all' ? mockApiData : mockApiData.filter(n => n.type === activeCategory);
          setNewsData(categoryFilter.length > 0 ? categoryFilter : mockApiData);
        }
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
    else speak(t('no_breaking_news'));
  };

  const getCategoryColor = (type) => {
    return CATEGORIES.find(c => c.id === type)?.color || '#1A1A40';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col bg-white min-h-full font-body">
      <div className="p-6 pb-2 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-display font-black text-[#1A1A40]">{t('news_hub')}</h1>
          <button onClick={handleListen} disabled={loading} className="flex items-center gap-2 bg-[#FF6F61] text-white px-5 py-2 rounded-full text-xs font-black shadow-lg shadow-[#FF6F61]/20">
            <Volume2 size={16} /> {t('listen')}
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('search_news')}
            className="w-full bg-gray-50 border-none rounded-[16px] py-4 pl-12 pr-4 text-sm text-[#1A1A40] font-bold focus:ring-2 focus:ring-[#0056B3]/10 outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{ backgroundColor: activeCategory === cat.id ? cat.color : '#F9FAFB', color: activeCategory === cat.id ? 'white' : '#1A1A40' }}
              className={`flex items-center gap-2 px-6 py-3 rounded-[12px] text-xs font-black whitespace-nowrap transition-all shadow-sm`}
            >
              <cat.icon size={16} />
              {t(cat.key)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-5 pb-24">
        {loading ? (
           <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#0056B3] border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : filteredNews.length > 0 ? filteredNews.map((news) => (
          <div key={news.id} className="bg-white border-2 border-gray-50 rounded-[24px] p-5 shadow-xl shadow-gray-200/20 relative overflow-hidden">
            {news.isBreaking && (
              <div className="absolute top-0 right-0 bg-[#FF6F61] text-white text-[10px] font-black px-4 py-1.5 rounded-bl-[16px] uppercase tracking-widest">
                {t('breaking')}
              </div>
            )}
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${getCategoryColor(news.type)}20` }}>
                <Newspaper size={16} style={{ color: getCategoryColor(news.type) }} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: getCategoryColor(news.type) }}>{news.source}</span>
                <span className="text-[10px] text-gray-400 font-bold">{news.time}</span>
              </div>
            </div>
            <div className="text-lg font-black text-[#1A1A40] mb-3 leading-tight">{news.content}</div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{news.readTime}</span>
              <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-black px-4 py-2 rounded-[10px] flex items-center gap-2 shadow-sm" style={{ backgroundColor: getCategoryColor(news.type), color: 'white' }}>
                {t('read_more')} <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )) : (
          <div className="text-center text-[#1A1A40] font-black text-sm mt-10 opacity-30">No articles found.</div>
        )}
      </div>
    </motion.div>
  );
}
