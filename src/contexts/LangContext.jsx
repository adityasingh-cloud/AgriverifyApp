import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  English: {
    dashboard: "Dashboard",
    community: "Community",
    support: "Support",
    profile: "Profile",
    scan_new_crop: "Scan New Crop",
    recent_scans: "Recent Scans",
    saved_certs: "Saved Certificates",
    market_prices: "Live Mandi Prices",
    total_verified: "Total Verified",
    avg_quality: "Avg Quality Score",
    total_earned: "Total Earned",
    good_morning: "Good Morning",
    speak_results: "Results are ready. Your crop has achieved Gold Grade with an 88 percent quality score."
  },
  Hindi: {
    dashboard: "डैशबोर्ड",
    community: "समुदाय",
    support: "सहायता",
    profile: "प्रोफ़ाइल",
    scan_new_crop: "नई फसल स्कैन करें",
    recent_scans: "हाल के स्कैन",
    saved_certs: "सहेजे गए प्रमाण पत्र",
    market_prices: "लाइव मंडी भाव",
    total_verified: "कुल सत्यापित",
    avg_quality: "औसत गुणवत्ता स्कोर",
    total_earned: "कुल कमाई",
    good_morning: "सुप्रभात",
    speak_results: "परिणाम तैयार हैं। आपकी फसल ने 88 प्रतिशत गुणवत्ता स्कोर के साथ गोल्ड ग्रेड हासिल किया है।"
  },
  // We can add more languages here as needed
};

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState('English');
  const [voiceGender, setVoiceGender] = useState('Female'); // Male or Female

  const t = (key) => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    return translations['English'][key] || key;
  };

  const speak = (textKey) => {
    const text = t(textKey);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Basic language mapping for TTS
      const langCode = lang === 'Hindi' ? 'hi-IN' : 'en-IN';
      utterance.lang = langCode;
      
      // Try to select voice based on gender
      const voices = window.speechSynthesis.getVoices();
      const availableVoices = voices.filter(v => v.lang.startsWith(langCode.split('-')[0]));
      
      if (availableVoices.length > 0) {
        // Very basic heuristic for male/female (TTS voices don't strictly expose gender in standard API, but we try)
        if (voiceGender === 'Female') {
          utterance.voice = availableVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('aditi')) || availableVoices[0];
        } else {
          utterance.voice = availableVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('ravi')) || availableVoices[0];
        }
      }
      
      utterance.rate = 0.9; // Smooth & Soft
      utterance.pitch = voiceGender === 'Female' ? 1.1 : 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang, voiceGender, setVoiceGender, t, speak, availableLangs: Object.keys(translations) }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
