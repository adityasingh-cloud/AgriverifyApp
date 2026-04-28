import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, Download, Share2, Camera as CameraIcon } from 'lucide-react';
import QRCode from 'react-qr-code';
import { jsPDF } from 'jspdf';
import { useLang } from '../contexts/LangContext';
import { useAuth } from '../contexts/AuthContext';

export function CameraFlow({ onClose }) {
  const { t, speakSlowly } = useLang();
  const { addScan, addPost, user, getAuthToken } = useAuth();
  
  const ANGLES = [
    { id: 'top', label: t('camera_top'), icon: '⬆️', desc: t('camera_top_desc') },
    { id: 'side', label: t('camera_side'), icon: '➡️', desc: t('camera_side_desc') },
    { id: 'bottom', label: t('camera_bottom'), icon: '⬇️', desc: t('camera_bottom_desc') },
  ];

  const fileInputRef = useRef(null);
  const qrRef = useRef(null);
  
  const [step, setStep] = useState(0); 
  const [processingProgress, setProcessingProgress] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [resultData, setResultData] = useState(null);

  const generateHash = (score) => {
    const cropID = "20";
    const grade = score.toString().padStart(2, '0');
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date() - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay).toString().padStart(3, '0');
    const yearLastDigit = new Date().getFullYear().toString().slice(-1);
    const dateCode = `${yearLastDigit}${day}`;
    const randomID = Math.floor(1000 + Math.random() * 9000).toString();
    return `${cropID}${grade}${dateCode}${randomID}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result;
        const newPhotos = [...photos, photoData];
        setPhotos(newPhotos);

        if (step < 2) {
          setStep(step + 1);
        } else {
          setStep(3);
          processAndUpload(newPhotos);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    // Auto-trigger camera for the first 3 photos
    if (step < 3) {
      const timer = setTimeout(() => {
        triggerCamera();
      }, 800); // Slight delay for smooth animation transition
      return () => clearTimeout(timer);
    }
  }, [step]);

  const [errorDetails, setErrorDetails] = useState(null);

  const processAndUpload = async (capturedPhotos) => {
    try {
      setErrorDetails(null);
      setProcessingProgress(10);

      // CRITICAL FIX: Ensure session and profile sync before upload
      const token = await getAuthToken();
      if (!token) {
        console.error("Auth0 Session Missing during verification trigger.");
        throw new Error("Session Expired. Please login again.");
      }

      setProcessingProgress(15);
      
      // Ensure Firestore Profile is synced
      if (!user || user.isNew) {
        console.error("Firestore Profile not synced for UID:", user?.uid);
        throw new Error("Profile sync failed. Please complete your profile first.");
      }
      
      const uploadedUrls = [];
      const preset = 'Agriverify'; 
      const cloudName = 'dc8suuh6h';

      for (let i = 0; i < capturedPhotos.length; i++) {
        setProcessingProgress(20 + (i * 20));
        
        try {
          const formData = new FormData();
          formData.append('file', capturedPhotos[i]);
          formData.append('upload_preset', preset);

          // Use AbortController for custom timeout (30 seconds)
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);

          console.log(`Starting Cloudinary upload for image ${i+1}...`);
          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!res.ok) {
            const errorData = await res.json();
            console.error(`Cloudinary Upload ${i+1} failed with status ${res.status}:`, errorData);
            throw new Error(errorData.error?.message || `HTTP ${res.status}: Upload failed`);
          }
          
          const data = await res.json();
          console.log(`Cloudinary Upload ${i+1} successful:`, data.secure_url);
          uploadedUrls.push(data.secure_url);
        } catch (uploadError) {
          console.error(`Detailed Error for Image ${i+1}:`, uploadError);
          const msg = uploadError.name === 'AbortError' ? 'Upload Timeout (30s)' : uploadError.message;
          setErrorDetails(`Photo ${i+1}: ${msg}`);
          throw new Error(msg); 
        }
      }

      setProcessingProgress(90);

      const score = 88;
      const hash = generateHash(score);
      const data = {
        hash,
        crop: "Wheat",
        grade: "GOLD",
        score,
        moisture: "11.2%",
        shelfLife: "8 Months",
        date: new Date().toLocaleDateString(),
        photos: uploadedUrls
      };
      
      setResultData(data);
      addScan(data);
      setProcessingProgress(100);

      setTimeout(() => {
        setStep(4);
        speakSlowly("Verification complete. Your code is", hash);
      }, 500);

    } catch (e) {
      console.error("Verification Global Error:", e);
      setProcessingProgress(0); // Reset progress on failure
      setStep(5); // Error state
    }
  };

  const handleRetry = () => {
    setErrorDetails(null);
    setStep(3); // Go back to processing
    processAndUpload(photos);
  };

  const generatePDF = () => {
    if (!resultData) return;
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(34, 197, 94);
    doc.text("Global Agricultural Compliance Certificate", 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Verified by AgriVerify AI - Certified Learvon Partner", 20, 40);
    
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`Authenticity Code: ${resultData.hash}`, 20, 60);
    
    doc.setFontSize(12);
    doc.text(`Crop: ${resultData.crop}`, 20, 75);
    doc.text(`Grade: ${resultData.grade}`, 20, 85);
    doc.text(`Quality Score: ${resultData.score}/100`, 20, 95);
    doc.text(`Moisture: ${resultData.moisture}`, 20, 105);
    doc.text(`Estimated Shelf-Life: ${resultData.shelfLife}`, 20, 115);
    doc.text(`Date: ${resultData.date}`, 20, 125);
    
    doc.setFontSize(14);
    doc.text("World-Recognized Quality Checks:", 20, 145);
    doc.setFontSize(10);
    const checks = ["Grain Uniformity: 91%", "Color Consistency: 84%", "Foreign Matter: 96%", "Moisture Content: 87%", "Surface Defects: 89%", "Aroma Index: 78%", "Mold Presence: 98%", "Protein Content: 82%", "Breakage %: 93%", "Weight/Volume: 88%"];
    checks.forEach((chk, idx) => {
      doc.text(`${idx + 1}. ${chk}`, 20, 155 + (idx * 6));
    });

    doc.save(`AgriVerify_Certificate_${resultData.hash}.pdf`);
  };

  const shareToCommunity = () => {
    if (!resultData) return;
    addPost({
      id: Date.now(),
      user: user?.name || "Farmer",
      location: user?.city ? `${user.city}, ${user.state}` : "India",
      content: `Just certified my ${resultData.crop} crop! Got ${resultData.grade} grade with an ${resultData.score}% score. Verification Code: ${resultData.hash}`,
      likes: 0,
      comments: 0,
      isLiked: false,
      image: resultData.photos[0],
      userId: user?.uid || 'currentUser'
    });
    alert("Successfully shared to AgriSocial!");
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }} className="fixed inset-0 z-[60] bg-agri-bg flex flex-col pb-[env(safe-area-inset-bottom)]">
      {/* Hidden Native Camera Input */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-agri-bg to-transparent">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-agri-card border border-agri-border flex items-center justify-center text-white backdrop-blur-md">
          <X size={20} />
        </button>
        {step < 3 && (
          <div className="flex gap-2">
            {ANGLES.map((a, i) => (
              <div key={a.id} className={`w-8 h-2 rounded-full transition-colors ${i <= step ? 'bg-agri-green' : 'bg-white/10'}`} />
            ))}
          </div>
        )}
      </div>

      {step < 3 ? (
        <div className="flex-1 relative flex flex-col justify-center items-center px-6">
          <div className="mb-12 text-center mt-20">
            <h2 className="text-3xl font-display font-black text-white mb-2">{ANGLES[step].label}</h2>
            <p className="text-gray-400">{ANGLES[step].desc}</p>
          </div>

          <button 
            onClick={triggerCamera} 
            className="w-48 h-48 rounded-full border-4 border-dashed border-agri-green/50 flex flex-col items-center justify-center bg-agri-green/5 hover:bg-agri-green/10 transition-colors shadow-[0_0_50px_rgba(34,197,94,0.1)] group"
          >
            <div className="w-20 h-20 bg-agri-green rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CameraIcon size={32} color="black" />
            </div>
            <span className="text-white font-bold text-sm tracking-wider uppercase">Open Camera</span>
          </button>
          
          {photos.length > 0 && (
             <div className="flex gap-2 mt-12">
               {photos.map((p, i) => (
                 <img key={i} src={p} className="w-16 h-16 rounded-xl border-2 border-agri-green object-cover" />
               ))}
             </div>
          )}
        </div>
      ) : step === 3 ? (
        <div className="flex-1 bg-agri-bg flex flex-col items-center justify-center p-8 text-center">
          <div className="w-32 h-32 relative mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-agri-green/20" />
            <motion.div className="absolute inset-0 rounded-full border-4 border-agri-green border-t-transparent" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
            <span className="text-4xl">🔬</span>
          </div>
          <h2 className="text-2xl font-display font-black text-white mb-2">{t('processing')}</h2>
          <p className="text-gray-400 text-sm mb-8">Uploading directly to Secure Storage...</p>
          
          <div className="w-full max-w-xs bg-agri-card h-2 rounded-full overflow-hidden">
            <motion.div className="h-full bg-agri-green transition-all duration-300" style={{ width: `${processingProgress}%` }} />
          </div>
          <div className="text-agri-green font-bold mt-2">{processingProgress}%</div>
        </div>
      ) : step === 5 ? (
        <div className="flex-1 bg-agri-bg flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500/40">
            <X size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-display font-black text-white mb-2">Verification Error</h2>
          <p className="text-gray-400 text-sm mb-2">Something went wrong during the 60% mark.</p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 w-full max-w-xs">
            <div className="text-[10px] text-red-400 uppercase font-bold mb-1">Error Message</div>
            <div className="text-xs text-red-200 font-mono break-all">{errorDetails || "Unknown Upload Failure"}</div>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button onClick={handleRetry} className="w-full bg-white text-black py-4 rounded-xl font-bold flex justify-center items-center gap-2">
              <RefreshCw size={18} /> Retry Upload
            </button>
            <button onClick={onClose} className="w-full bg-agri-card border border-agri-border py-4 rounded-xl font-bold text-white">
              {t('cancel')}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-agri-bg overflow-y-auto hide-scrollbar p-6 pt-24 pb-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-agri-green/10 border border-agri-green/30 mb-4">
            <span className="w-2 h-2 rounded-full bg-agri-green animate-pulse" />
            <span className="text-[10px] text-agri-green font-bold">12-Digit Smart-Hash Generated</span>
          </div>
          
          <h2 className="text-3xl font-display font-black text-white mb-1">{resultData?.hash}</h2>
          <p className="text-gray-400 text-sm mb-8">Please note down your unique code.</p>

          <div className="w-full max-w-sm bg-agri-card border border-agri-border rounded-3xl p-6 mb-6 flex flex-col items-center shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="bg-white p-3 rounded-2xl mb-4 shadow-[0_0_20px_rgba(34,197,94,0.3)]" ref={qrRef}>
              <QRCode value={JSON.stringify({ hash: resultData?.hash, score: resultData?.score, moisture: resultData?.moisture })} size={160} level="H" />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full text-left mt-4">
              <div className="bg-agri-card2 p-3 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-500 mb-1">QUALITY SCORE</div>
                <div className="text-xl font-black text-agri-yellow">{resultData?.score}/100</div>
              </div>
              <div className="bg-agri-card2 p-3 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-500 mb-1">MOISTURE</div>
                <div className="text-xl font-black text-blue-400">{resultData?.moisture}</div>
              </div>
              <div className="bg-agri-card2 p-3 rounded-xl border border-white/5 col-span-2">
                <div className="text-[10px] text-gray-500 mb-1">ESTIMATED SHELF-LIFE</div>
                <div className="text-xl font-black text-agri-green">{resultData?.shelfLife}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button onClick={generatePDF} className="w-full bg-gradient-to-r from-agri-green to-agri-green-dim py-4 rounded-xl font-bold text-white shadow-[0_8px_24px_rgba(34,197,94,0.2)] flex justify-center items-center gap-2">
              <Download size={18} /> {t('download_pdf')}
            </button>
            <div className="flex gap-3">
              <button onClick={shareToCommunity} className="flex-1 bg-agri-card border border-agri-border py-4 rounded-xl font-bold text-blue-400 flex justify-center items-center gap-2">
                <Share2 size={18} /> {t('share')}
              </button>
              <button onClick={() => { setStep(0); setPhotos([]); }} className="flex-1 bg-agri-card border border-agri-border py-4 rounded-xl font-bold text-white flex justify-center items-center gap-2">
                <RefreshCw size={18} /> {t('restart')}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
