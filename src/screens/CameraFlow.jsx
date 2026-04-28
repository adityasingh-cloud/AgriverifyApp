import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Camera as CameraIcon, RefreshCw, Download } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useLang } from '../contexts/LangContext';

const ANGLES = [
  { id: 'top', label: 'Top View', icon: '⬆️', desc: 'Hold camera directly above' },
  { id: 'side', label: 'Side View', icon: '➡️', desc: 'Tilt 45° for side profile' },
  { id: 'bottom', label: 'Bottom View', icon: '⬇️', desc: 'Flip and capture base' },
];

export function CameraFlow({ onClose }) {
  const { speak } = useLang();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [step, setStep] = useState(0); // 0,1,2 = angles, 3 = processing, 4 = result
  const [processingProgress, setProcessingProgress] = useState(0);

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

  const handleCapture = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      stopCamera();
      setStep(3); // Start processing
      simulateProcessing();
    }
  };

  const simulateProcessing = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProcessingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStep(4);
          speak('speak_results'); // Trigger voice
        }, 500);
      }
    }, 150);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
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
          <h2 className="text-2xl font-display font-black text-white mb-2">Analyzing Crop...</h2>
          <p className="text-gray-400 text-sm mb-8">Running multi-spectral ML models</p>
          
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
            <span className="text-[10px] text-agri-green font-bold">Verified on Polygon Blockchain</span>
          </div>
          
          <h2 className="text-3xl font-display font-black text-white mb-1">Wheat — GOLD</h2>
          <p className="text-gray-400 text-sm mb-8">Batch ID: #AGRI-8892-XT</p>

          <div className="w-full max-w-sm bg-agri-card border border-agri-border rounded-3xl p-6 mb-6 flex flex-col items-center shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="bg-white p-3 rounded-2xl mb-4 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <QRCode 
                value={JSON.stringify({ batch: 'AGRI-8892-XT', score: 88, moisture: '11.2%', shelfLife: '8 Months' })}
                size={160}
                level="H"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full text-left mt-4">
              <div className="bg-agri-card2 p-3 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-500 mb-1">QUALITY SCORE</div>
                <div className="text-xl font-black text-agri-yellow">88/100</div>
              </div>
              <div className="bg-agri-card2 p-3 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-500 mb-1">MOISTURE</div>
                <div className="text-xl font-black text-blue-400">11.2%</div>
              </div>
              <div className="bg-agri-card2 p-3 rounded-xl border border-white/5 col-span-2">
                <div className="text-[10px] text-gray-500 mb-1">ESTIMATED SHELF-LIFE</div>
                <div className="text-xl font-black text-agri-green">8 Months</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full max-w-sm">
            <button className="flex-1 bg-gradient-to-r from-agri-green to-agri-green-dim py-4 rounded-xl font-bold text-white shadow-[0_8px_24px_rgba(34,197,94,0.2)] flex justify-center items-center gap-2">
              <Download size={18} /> Save QR
            </button>
            <button onClick={() => setStep(0)} className="flex-1 bg-agri-card border border-agri-border py-4 rounded-xl font-bold text-white flex justify-center items-center gap-2">
              <RefreshCw size={18} /> Restart
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
