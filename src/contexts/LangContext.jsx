import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  English: {
    dashboard: "Dashboard", community: "Social", news: "News", profile: "Profile", support: "Support",
    scan_new_crop: "Scan New Crop", recent_scans: "Recent Scans", saved_certs: "Saved Certificates",
    market_prices: "Live Mandi Prices", total_verified: "Total Verified", avg_quality: "Avg Quality Score",
    total_earned: "Total Earned", good_morning: "Good Morning",
    news_hub: "AgriNews Hub", listen: "Listen", search_news: "Search news...", 
    cat_all: "All", cat_subsidies: "Subsidies", cat_market: "Market Prices", cat_tech: "Tech Innovations", cat_global: "Global",
    breaking_news_alert: "Breaking News Alert", no_breaking_news: "There is no breaking news at the moment.",
    breaking: "Breaking", read_more: "Read More",
    feed: "Feed", messages: "Messages", search_users: "Search farmers...", post: "Post",
    followers: "Followers", following: "Following", private_account: "Private Account",
    this_account_is_private: "This account is private. Follow to see their posts.", follow: "Follow", unfollow: "Unfollow",
    camera_top: "Top View", camera_side: "Side View", camera_bottom: "Bottom View",
    camera_top_desc: "Hold camera directly above", camera_side_desc: "Tilt 45° for side profile", camera_bottom_desc: "Flip and capture base",
    processing: "Generating Authentic Hash...", securing: "Securing batch data on the ledger",
    download_pdf: "Download Compliance PDF", share: "Share", restart: "Restart",
    verify_batch: "Verify Authenticity Batch", enter_hash: "Enter 12-Digit Smart-Hash...", verify: "Verify", wait: "Wait..",
    profile_settings: "Profile Settings", app_language: "App Language", ai_voice: "AI Voice Assistant",
    account: "Account", edit_profile: "Edit Profile Info", data_privacy: "Data & Privacy Settings", secure_logout: "Secure Logout",
    private_profile: "Private Profile", certified_partner: "Certified Learvon Partner",
    login_phone: "Continue with Phone", login_google: "Continue with Google", complete_profile: "Complete Profile",
    start_using: "Start Using AgriVerify"
  },
  Hindi: {
    dashboard: "डैशबोर्ड", community: "सामाजिक", news: "समाचार", profile: "प्रोफ़ाइल", support: "सहायता",
    scan_new_crop: "नई फसल स्कैन करें", recent_scans: "हाल के स्कैन", saved_certs: "सहेजे गए प्रमाण पत्र",
    market_prices: "लाइव मंडी भाव", total_verified: "कुल सत्यापित", avg_quality: "औसत गुणवत्ता स्कोर",
    total_earned: "कुल कमाई", good_morning: "सुप्रभात",
    news_hub: "कृषि समाचार", listen: "सुनें", search_news: "समाचार खोजें...",
    cat_all: "सभी", cat_subsidies: "सब्सिडी", cat_market: "मंडी भाव", cat_tech: "तकनीक", cat_global: "वैश्विक",
    breaking_news_alert: "ब्रेकिंग न्यूज़ अलर्ट", no_breaking_news: "इस समय कोई ब्रेकिंग न्यूज़ नहीं है।",
    breaking: "ब्रेकिंग", read_more: "और पढ़ें",
    feed: "फ़ीड", messages: "संदेश", search_users: "किसानों को खोजें...", post: "पोस्ट करें",
    followers: "फॉलोअर्स", following: "फॉलोइंग", private_account: "निजी खाता",
    this_account_is_private: "यह खाता निजी है। पोस्ट देखने के लिए फॉलो करें।", follow: "फॉलो करें", unfollow: "अनफॉलो करें",
    camera_top: "ऊपर का दृश्य", camera_side: "साइड का दृश्य", camera_bottom: "नीचे का दृश्य",
    camera_top_desc: "कैमरा सीधा ऊपर रखें", camera_side_desc: "45° झुकाएं", camera_bottom_desc: "पलटें और नीचे से लें",
    processing: "प्रामाणिक हैश जनरेट हो रहा है...", securing: "लेजर पर बैच डेटा सुरक्षित किया जा रहा है",
    download_pdf: "अनुपालन पीडीएफ डाउनलोड करें", share: "साझा करें", restart: "पुनः आरंभ करें",
    verify_batch: "प्रामाणिकता बैच सत्यापित करें", enter_hash: "12-अंकीय स्मार्ट-हैश दर्ज करें...", verify: "सत्यापित करें", wait: "प्रतीक्षा करें..",
    profile_settings: "प्रोफ़ाइल सेटिंग्स", app_language: "ऐप की भाषा", ai_voice: "एआई वॉयस असिस्टेंट",
    account: "खाता", edit_profile: "प्रोफ़ाइल जानकारी संपादित करें", data_privacy: "डेटा और गोपनीयता सेटिंग्स", secure_logout: "सुरक्षित लॉगआउट",
    private_profile: "निजी प्रोफ़ाइल", certified_partner: "प्रमाणित लर्नवॉन पार्टनर",
    login_phone: "फोन के साथ जारी रखें", login_google: "गूगल के साथ जारी रखें", complete_profile: "प्रोफ़ाइल पूरी करें",
    start_using: "AgriVerify का उपयोग शुरू करें"
  }
};

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState('English');
  const [voiceGender, setVoiceGender] = useState('Female');

  useEffect(() => {
    const savedLang = localStorage.getItem('agriverify_lang');
    const savedVoice = localStorage.getItem('agriverify_voice');
    if (savedLang) setLang(savedLang);
    if (savedVoice) setVoiceGender(savedVoice);
  }, []);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('agriverify_lang', l);
  };

  const changeVoice = (v) => {
    setVoiceGender(v);
    localStorage.setItem('agriverify_voice', v);
  };

  const t = (key) => {
    if (translations[lang] && translations[lang][key]) return translations[lang][key];
    return translations['English'][key] || key;
  };

  const getVoice = (langCode) => {
    const voices = window.speechSynthesis.getVoices();
    const available = voices.filter(v => v.lang.startsWith(langCode.split('-')[0]));
    if (available.length > 0) {
      if (voiceGender === 'Female') {
        return available.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('aditi')) || available[0];
      } else {
        return available.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('ravi')) || available[0];
      }
    }
    return null;
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langCode = lang === 'Hindi' ? 'hi-IN' : 'en-IN';
      utterance.lang = langCode;
      const voice = getVoice(langCode);
      if (voice) utterance.voice = voice;
      utterance.rate = 0.9;
      utterance.pitch = voiceGender === 'Female' ? 1.1 : 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakSlowly = (prefix, code) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const chunks = code.match(/.{1,2}/g).join(', ');
      const text = `${prefix} ${chunks}. Repeating: ${chunks}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      const langCode = lang === 'Hindi' ? 'hi-IN' : 'en-IN';
      utterance.lang = langCode;
      const voice = getVoice(langCode);
      if (voice) utterance.voice = voice;
      utterance.rate = 0.75; 
      utterance.pitch = voiceGender === 'Female' ? 1.1 : 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, voiceGender, setVoiceGender: changeVoice, t, speak, speakSlowly, availableLangs: Object.keys(translations) }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
