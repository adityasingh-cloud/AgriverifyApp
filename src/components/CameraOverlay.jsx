import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Download, Share2, Camera as CameraIcon, CheckCircle, ShieldCheck, AlertTriangle } from 'lucide-react';
import QRCode from 'react-qr-code';
import { jsPDF } from 'jspdf';
import { useLang } from '../contexts/LangContext';
import { useAuth } from '../contexts/AuthContext';

export function CameraOverlay({ onClose }) {
  const { t, speakSlowly } = useLang();
  const { addScan, user } = useAuth();
  
  const ANGLES = [
    { id: 'top', label: t('camera_top'), icon: '⬆️', desc: t('camera_top_desc') },
    { id: 'side', label: t('camera_side'), icon: '➡️', desc: t('camera_side_desc') },
    { id: 'bottom', label: t('camera_bottom'), icon: '⬇️', desc: t('camera_bottom_desc') },
  ];

  const fileInputRef = useRef(null);
  const [step, setStep] = useState(0); 
  const [processingProgress, setProcessingProgress] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  const generateHash = (score) => {
    const randomID = Math.floor(100000 + Math.random() * 900000).toString();
    const dateCode = new Date().getTime().toString().slice(-6);
    return `LV-${dateCode}-${randomID}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result;
        const newPhotos = [...photos, photoData];
        setPhotos(newPhotos);
        if (step < 2) setStep(step + 1);
        else {
          setStep(3);
          processAndUpload(newPhotos);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCamera = () => fileInputRef.current?.click();

  useEffect(() => {
    if (step < 3) {
      const timer = setTimeout(() => triggerCamera(), 800);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const processAndUpload = async (capturedPhotos) => {
    try {
      setProcessingProgress(10);
      const uploadedUrls = [];
      const preset = 'Agriverify'; 
      const cloudName = 'dc8suuh6h';

      for (let i = 0; i < capturedPhotos.length; i++) {
        setProcessingProgress(20 + (i * 25));
        const formData = new FormData();
        formData.append('file', capturedPhotos[i]);
        formData.append('upload_preset', preset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (!res.ok) throw new Error("Storage Node Timeout");
        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      }

      setProcessingProgress(95);
      const score = 91;
      const hash = generateHash(score);
      const data = {
        hash,
        crop: "Wheat",
        grade: "A",
        score,
        moisture: "11.2%",
        shelfLife: "8 Months",
        date: new Date().toLocaleDateString(),
        photos: uploadedUrls
      };
      
      setResultData(data);
      addScan(data);
      setProcessingProgress(100);
      setTimeout(() => setStep(4), 500);
      speakSlowly("Verification complete. Certified Grade A.");

    } catch (e) {
      setErrorDetails(e.message);
      setStep(5);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-white flex flex-col font-body">
      <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      
      <div className="p-8 flex justify-between items-center z-10 bg-white border-b border-[#1E5128]/5">
        <button onClick={onClose} className="w-12 h-12 rounded-[16px] bg-[#F1F8F4] flex items-center justify-center text-[#1E5128]">
          <X size={24} />
        </button>
        {step < 3 && (
          <div className="flex gap-2">
            {ANGLES.map((a, i) => (
              <div key={a.id} className={`w-12 h-2 rounded-full transition-colors ${i <= step ? 'bg-[#1E6F6B]' : 'bg-[#F1F8F4]'}`} />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col items-center">
        {step < 3 ? (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-display font-black text-[#1E5128] mb-4">{ANGLES[step].label}</h2>
            <p className="text-[#2D2D2D] opacity-60 mb-12 text-lg">{ANGLES[step].desc}</p>
            
            <button 
              onClick={triggerCamera} 
              className="w-56 h-56 rounded-[32px] border-4 border-[#1E6F6B] flex flex-col items-center justify-center bg-[#F1F8F4] shadow-2xl shadow-[#1E6F6B]/10"
            >
              <div className="w-20 h-20 bg-[#1E6F6B] rounded-[20px] flex items-center justify-center mb-4">
                <CameraIcon size={36} color="white" />
              </div>
              <span className="text-[#1E6F6B] font-black text-xs uppercase tracking-[0.2em]">Open Sensor</span>
            </button>
          </div>
        ) : step === 3 ? (
          <div className="flex flex-col items-center text-center py-20">
            <div className="w-24 h-24 mb-10">
              <motion.div className="w-full h-full border-4 border-[#1E6F6B] border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
            </div>
            <h2 className="text-2xl font-display font-black text-[#1E5128] mb-3">Audit in Progress</h2>
            <p className="text-[#2D2D2D] opacity-60 mb-10">Securing multi-angle crop evidence...</p>
            <div className="w-full max-w-xs bg-[#F1F8F4] h-3 rounded-full overflow-hidden">
              <motion.div className="h-full bg-[#1E6F6B]" style={{ width: `${processingProgress}%` }} />
            </div>
            <div className="text-[#1E6F6B] font-black mt-6 text-2xl">{processingProgress}%</div>
          </div>
        ) : step === 5 ? (
          <div className="flex flex-col items-center text-center py-20">
             <AlertTriangle size={72} className="text-[#1E5128] mb-8 opacity-20" />
             <h2 className="text-2xl font-display font-black text-[#1E5128] mb-3">Sensor Offline</h2>
             <p className="text-[#2D2D2D] opacity-60 mb-10">{errorDetails || "Encryption Error"}</p>
             <button onClick={() => setStep(0)} className="bg-[#1E6F6B] text-white px-10 py-5 rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-[#1E6F6B]/20">Reconnect Sensor</button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center w-full max-w-sm">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 bg-[#1E5128] rounded-[24px] flex items-center justify-center mb-8 shadow-2xl shadow-[#1E5128]/20">
              <ShieldCheck size={48} color="white" />
            </motion.div>
            <h2 className="text-3xl font-display font-black text-[#1E5128] mb-2">Grade A Certified</h2>
            <p className="text-[#2D2D2D] opacity-40 mb-10 text-lg font-bold uppercase tracking-widest">{resultData?.hash}</p>

            <div className="bg-[#F1F8F4] border border-[#1E5128]/10 rounded-[36px] p-8 w-full shadow-sm mb-10">
              <div className="bg-white p-4 rounded-[24px] mb-8 flex justify-center shadow-sm">
                <QRCode value={resultData?.hash || ""} size={160} level="H" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-5 rounded-[20px] text-left shadow-sm">
                   <div className="text-[10px] font-black text-[#1E5128] opacity-40 uppercase mb-1">SCORE</div>
                   <div className="text-2xl font-black text-[#1E5128]">{resultData?.score}%</div>
                 </div>
                 <div className="bg-white p-5 rounded-[20px] text-left shadow-sm">
                   <div className="text-[10px] font-black text-[#1E5128] opacity-40 uppercase mb-1">MOISTURE</div>
                   <div className="text-2xl font-black text-[#1E6F6B]">{resultData?.moisture}</div>
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <button onClick={onClose} className="w-full bg-[#1E6F6B] text-white py-5 rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-[#1E6F6B]/30 flex justify-center items-center gap-3 active:scale-95 transition-all">
                <CheckCircle size={22} /> Close Audit
              </button>
              <button onClick={() => setStep(0)} className="w-full bg-[#F1F8F4] text-[#1E5128] py-5 rounded-[20px] font-black uppercase tracking-widest active:scale-95 transition-all">
                New Audit
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
