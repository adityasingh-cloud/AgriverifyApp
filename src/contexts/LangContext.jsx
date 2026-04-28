import React, { createContext, useContext, useState } from 'react';

const translations = {
  English: {
    dashboard: "Dashboard", community: "Community", support: "Support", profile: "Profile",
    scan_new_crop: "Scan New Crop", recent_scans: "Recent Scans", saved_certs: "Saved Certificates",
    market_prices: "Live Mandi Prices", total_verified: "Total Verified", avg_quality: "Avg Quality Score",
    total_earned: "Total Earned", good_morning: "Good Morning"
  },
  Hindi: {
    dashboard: "डैशबोर्ड", community: "समुदाय", support: "सहायता", profile: "प्रोफ़ाइल",
    scan_new_crop: "नई फसल स्कैन करें", recent_scans: "हाल के स्कैन", saved_certs: "सहेजे गए प्रमाण पत्र",
    market_prices: "लाइव मंडी भाव", total_verified: "कुल सत्यापित", avg_quality: "औसत गुणवत्ता स्कोर",
    total_earned: "कुल कमाई", good_morning: "सुप्रभात"
  }
};

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState('English');
  const [voiceGender, setVoiceGender] = useState('Female');

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
      // Chunk the code into pairs of two digits
      const chunks = code.match(/.{1,2}/g).join(', ');
      const text = `${prefix} ${chunks}. Repeating: ${chunks}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      const langCode = lang === 'Hindi' ? 'hi-IN' : 'en-IN';
      utterance.lang = langCode;
      const voice = getVoice(langCode);
      if (voice) utterance.voice = voice;
      utterance.rate = 0.75; // Slower for reading codes
      utterance.pitch = voiceGender === 'Female' ? 1.1 : 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang, voiceGender, setVoiceGender, t, speak, speakSlowly, availableLangs: Object.keys(translations) }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
