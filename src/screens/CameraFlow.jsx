import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, Download, Share2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import { jsPDF } from 'jspdf';
import { useLang } from '../contexts/LangContext';
import { useAuth } from '../contexts/AuthContext';

const ANGLES = [
  { id: 'top', label: 'Top View', icon: '⬆️', desc: 'Hold camera directly above' },
  { id: 'side', label: 'Side View', icon: '➡️', desc: 'Tilt 45° for side profile' },
  { id: 'bottom', label: 'Bottom View', icon: '⬇️', desc: 'Flip and capture base' },
];

export function CameraFlow({ onClose }) {
  const { speakSlowly } = useLang();
  const { addScan, addPost, user } = useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const qrRef = useRef(null);
  
  const [step, setStep] = useState(0); 
  const [processingProgress, setProcessingProgress] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    return null;
  };

  const generateHash = (score) => {
    const cropID = "20"; // Hardcoded for Wheat/Example
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

  const handleCapture = () => {
    const photo = capturePhoto();
    const newPhotos = [...photos, photo];
    setPhotos(newPhotos);

    if (step < 2) {
      setStep(step + 1);
    } else {
      stopCamera();
      setStep(3);
      simulateProcessing(newPhotos);
    }
  };

  const simulateProcessing = (capturedPhotos) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProcessingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
        const score = 88; // Example simulated score
        const hash = generateHash(score);
        const data = {
          hash,
          crop: "Wheat",
          grade: "GOLD",
          score,
          moisture: "11.2%",
          shelfLife: "8 Months",
          date: new Date().toLocaleDateString(),
          photos: capturedPhotos
        };
        
        setResultData(data);
        addScan(data);

        setTimeout(() => {
          setStep(4);
          speakSlowly("Verification complete. Your code is", hash);
        }, 500);
      }
    }, 100);
  };

  const generatePDF = () => {
    if (!resultData) return;
    const doc = new jsPDF();
    
    // Header & Seal
    doc.setFontSize(22);
    doc.setTextColor(34, 197, 94);
    doc.text("Global Agricultural Compliance Certificate", 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Verified by AgriVerify AI - Certified Learvon Partner", 20, 40);
    
    // Hash
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`Authenticity Code: ${resultData.hash}`, 20, 60);
    
    // Details
    doc.setFontSize(12);
    doc.text(`Crop: ${resultData.crop}`, 20, 75);
    doc.text(`Grade: ${resultData.grade}`, 20, 85);
    doc.text(`Quality Score: ${resultData.score}/100`, 20, 95);
    doc.text(`Moisture: ${resultData.moisture}`, 20, 105);
    doc.text(`Estimated Shelf-Life: ${resultData.shelfLife}`, 20, 115);
    doc.text(`Date: ${resultData.date}`, 20, 125);
    
    // Quality Checks (Mock 10 checks)
    doc.setFontSize(14);
    doc.text("World-Recognized Quality Checks:", 20, 145);
    doc.setFontSize(10);
    const checks = ["Grain Uniformity: 91%", "Color Consistency: 84%", "Foreign Matter: 96%", "Moisture Content: 87%", "Surface Defects: 89%", "Aroma Index: 78%", "Mold Presence: 98%", "Protein Content: 82%", "Breakage %: 93%", "Weight/Volume: 88%"];
    checks.forEach((chk, idx) => {
      doc.text(`${idx + 1}. ${chk}`, 20, 155 + (idx * 6));
    });

    // Embed Photos
    if (resultData.photos && resultData.photos.length === 3) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Visual Evidence (Top, Side, Bottom)", 20, 20);
      try {
        doc.addImage(resultData.photos[0], 'JPEG', 20, 30, 80, 80);
        doc.addImage(resultData.photos[1], 'JPEG', 110, 30, 80, 80);
        doc.addImage(resultData.photos[2], 'JPEG', 65, 120, 80, 80);
      } catch (e) {
        console.error("Failed to add image to PDF", e);
      }
    }

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
      image: resultData.photos[0] // Share the first photo
    });
    alert("Successfully shared to AgriSocial!");
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
          <X size={20} />
        </button>
        {step < 3 && (
          <div className="flex gap-2">
            {ANGLES.map((a, i) => (
              <div key={a.id} className={`w-8 h-2 rounded-full transition-colors ${i <= step ? 'bg-agri-green' : 'bg-white/20'}`} />
            ))}
          </div>
        )}
      </div>

      {step < 3 ? (
        // CAMERA VIEW
        <div className="flex-1 relative flex flex-col justify-end pb-12">
          <video 
            ref={videoRef} 
            autoPlay playsInline muted 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay UI */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-[70%] aspect-square border-2 border-dashed border-agri-green rounded-3xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-agri-green/50 shadow-[0_0_15px_rgba(34,197,94,1)] animate-pulse" />
            </div>
            <div className="mt-8 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
              <span className="text-2xl">{ANGLES[step].icon}</span>
              <div>
                <div className="text-white font-bold text-sm">{ANGLES[step].label}</div>
                <div className="text-gray-300 text-xs">{ANGLES[step].desc}</div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 flex justify-center w-full px-8 pb-8">
            <button 
              onClick={handleCapture}
              className="w-20 h-20 rounded-full border-4 border-agri-green flex items-center justify-center bg-black/20 backdrop-blur-md hover:scale-95 transition-transform"
            >
              <div className="w-16 h-16 rounded-full bg-white" />
            </button>
          </div>
        </div>
      ) : step === 3 ? (
        // PROCESSING VIEW
        <div className="flex-1 bg-agri-bg flex flex-col items-center justify-center p-8 text-center">
          <div className="w-32 h-32 relative mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-agri-green/20" />
            <motion.div 
              className="absolute inset-0 rounded-full border-4 border-agri-green border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <span className="text-4xl">🔬</span>
          </div>
          <h2 className="text-2xl font-display font-black text-white mb-2">Generating Authentic Hash...</h2>
          <p className="text-gray-400 text-sm mb-8">Securing batch data on the ledger</p>
          
          <div className="w-full max-w-xs bg-agri-card h-2 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-agri-green"
              initial={{ width: 0 }}
              animate={{ width: `${processingProgress}%` }}
            />
          </div>
          <div className="text-agri-green font-bold mt-2">{processingProgress}%</div>
        </div>
      ) : (
        // RESULT VIEW
        <div className="flex-1 bg-agri-bg overflow-y-auto hide-scrollbar p-6 pt-24 pb-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-agri-green/10 border border-agri-green/30 mb-4">
            <span className="w-2 h-2 rounded-full bg-agri-green animate-pulse" />
            <span className="text-[10px] text-agri-green font-bold">12-Digit Smart-Hash Generated</span>
          </div>
          
          <h2 className="text-3xl font-display font-black text-white mb-1">{resultData?.hash}</h2>
          <p className="text-gray-400 text-sm mb-8">Please note down your unique code.</p>

          <div className="w-full max-w-sm bg-agri-card border border-agri-border rounded-3xl p-6 mb-6 flex flex-col items-center shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="bg-white p-3 rounded-2xl mb-4 shadow-[0_0_20px_rgba(34,197,94,0.3)]" ref={qrRef}>
              <QRCode 
                value={JSON.stringify({ hash: resultData?.hash, score: resultData?.score, moisture: resultData?.moisture })}
                size={160}
                level="H"
              />
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
              <Download size={18} /> Download Compliance PDF
            </button>
            <div className="flex gap-3">
              <button onClick={shareToCommunity} className="flex-1 bg-agri-card border border-agri-border py-4 rounded-xl font-bold text-blue-400 flex justify-center items-center gap-2">
                <Share2 size={18} /> Share
              </button>
              <button onClick={() => { setStep(0); setPhotos([]); }} className="flex-1 bg-agri-card border border-agri-border py-4 rounded-xl font-bold text-white flex justify-center items-center gap-2">
                <RefreshCw size={18} /> Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
