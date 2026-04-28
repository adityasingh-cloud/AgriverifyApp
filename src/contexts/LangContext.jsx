import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LangContext = createContext();

export function LangProvider({ children }) {
  const { t, i18n } = useTranslation();
  const [lang, setLangState] = useState(i18n.language || 'en');
  const [voiceGender, setVoiceGender] = useState(localStorage.getItem('agriverify_voice') || 'Female');

  const setLang = (l) => {
    setLangState(l);
    i18n.changeLanguage(l);
    localStorage.setItem('agriverify_lang', l);
  };

  const changeVoice = (v) => {
    setVoiceGender(v);
    localStorage.setItem('agriverify_voice', v);
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
      const langCode = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : lang === 'bn' ? 'bn-IN' : lang === 'te' ? 'te-IN' : lang === 'pa' ? 'pa-IN' : 'en-IN';
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
      // Using translations for the 'Repeating' part of the voice feedback
      const text = `${prefix} ${chunks}. ${t('repeating') || 'Repeating'}: ${chunks}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      const langCode = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : lang === 'bn' ? 'bn-IN' : lang === 'te' ? 'te-IN' : lang === 'pa' ? 'pa-IN' : 'en-IN';
      utterance.lang = langCode;
      const voice = getVoice(langCode);
      if (voice) utterance.voice = voice;
      utterance.rate = 0.75; 
      utterance.pitch = voiceGender === 'Female' ? 1.1 : 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang, voiceGender, setVoiceGender: changeVoice, t, speak, speakSlowly, availableLangs: ['en', 'hi', 'bn', 'mr', 'te', 'pa'] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
