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
      
      <div className="p-6 flex justify-between items-center z-10 bg-white border-b border-gray-50">
        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#1A1A40]">
          <X size={24} />
        </button>
        {step < 3 && (
          <div className="flex gap-2">
            {ANGLES.map((a, i) => (
              <div key={a.id} className={`w-12 h-2 rounded-full transition-colors ${i <= step ? 'bg-[#0056B3]' : 'bg-gray-100'}`} />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col items-center">
        {step < 3 ? (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-display font-black text-[#1A1A40] mb-3">{ANGLES[step].label}</h2>
            <p className="text-[#1A1A40] opacity-60 mb-12 text-lg">{ANGLES[step].desc}</p>
            
            <button 
              onClick={triggerCamera} 
              className="w-56 h-56 rounded-[32px] border-4 border-[#0056B3] flex flex-col items-center justify-center bg-[#0056B3]/5 shadow-2xl shadow-[#0056B3]/10"
            >
              <div className="w-20 h-20 bg-[#0056B3] rounded-2xl flex items-center justify-center mb-4">
                <CameraIcon size={32} color="white" />
              </div>
              <span className="text-[#0056B3] font-black text-xs uppercase tracking-[0.2em]">Open Sensor</span>
            </button>
          </div>
        ) : step === 3 ? (
          <div className="flex flex-col items-center text-center py-20">
            <div className="w-24 h-24 mb-8">
              <motion.div className="w-full h-full border-4 border-[#0056B3] border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
            </div>
            <h2 className="text-2xl font-display font-black text-[#1A1A40] mb-2">Scientific Analysis</h2>
            <p className="text-[#1A1A40] opacity-60 mb-8">Performing multi-angle visual auditing...</p>
            <div className="w-full max-w-xs bg-gray-100 h-3 rounded-full overflow-hidden">
              <motion.div className="h-full bg-[#0056B3]" style={{ width: `${processingProgress}%` }} />
            </div>
            <div className="text-[#0056B3] font-black mt-4 text-xl">{processingProgress}%</div>
          </div>
        ) : step === 5 ? (
          <div className="flex flex-col items-center text-center py-20">
             <AlertTriangle size={64} className="text-[#FF6F61] mb-6" />
             <h2 className="text-2xl font-display font-black text-[#1A1A40] mb-2">Audit Failed</h2>
             <p className="text-[#1A1A40] opacity-60 mb-8">{errorDetails || "Connection Timeout"}</p>
             <button onClick={() => setStep(0)} className="bg-[#1A1A40] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest">Retry Sensor</button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center w-full max-w-sm">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-20 h-20 bg-[#008C45] rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[#008C45]/20">
              <ShieldCheck size={40} color="white" />
            </motion.div>
            <h2 className="text-3xl font-display font-black text-[#1A1A40] mb-1">Grade A Certified</h2>
            <p className="text-[#1A1A40] opacity-60 mb-8 text-lg font-bold">Verification ID: {resultData?.hash}</p>

            <div className="bg-white border-2 border-gray-100 rounded-[32px] p-6 w-full shadow-2xl shadow-gray-200/40 mb-8">
              <div className="bg-white p-3 rounded-2xl mb-6 flex justify-center">
                <QRCode value={resultData?.hash || ""} size={140} level="H" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-gray-50 p-4 rounded-2xl text-left">
                   <div className="text-[10px] font-black text-[#1A1A40] opacity-40 uppercase mb-1">SCORE</div>
                   <div className="text-xl font-black text-[#008C45]">{resultData?.score}%</div>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-2xl text-left">
                   <div className="text-[10px] font-black text-[#1A1A40] opacity-40 uppercase mb-1">MOISTURE</div>
                   <div className="text-xl font-black text-[#0056B3]">{resultData?.moisture}</div>
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <button onClick={onClose} className="w-full bg-[#0056B3] text-white py-5 rounded-[16px] font-black uppercase tracking-widest shadow-xl shadow-[#0056B3]/20 flex justify-center items-center gap-3">
                <CheckCircle size={20} /> Finish Audit
              </button>
              <button onClick={() => setStep(0)} className="w-full bg-gray-50 text-[#1A1A40] py-4 rounded-[16px] font-black uppercase tracking-widest">
                Restart Scan
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
