
import React, { useState, useEffect } from 'react';
import VFXHeader from './components/VFXHeader';
import ImageSlot from './components/ImageSlot';
import { SynthesisStatus } from './types';
import { synthesizeImages } from './services/geminiService';

const App: React.FC = () => {
  const [imageA, setImageA] = useState<string | null>(null);
  const [imageB, setImageB] = useState<string | null>(null);
  const [status, setStatus] = useState<SynthesisStatus>(SynthesisStatus.IDLE);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Preparing Silk Thread...");

  const loadingMessages = [
    "Harvesting Identity...",
    "Tracing Pose Contours...",
    "Aligning Organic Forms...",
    "Refining the Composition...",
    "Balancing Natural Tones...",
    "Polishing the Vision...",
    "Finalizing Synthesis..."
  ];

  useEffect(() => {
    let interval: any;
    if (status === SynthesisStatus.PROCESSING) {
      let i = 0;
      interval = setInterval(() => {
        setLoadingMessage(loadingMessages[i % loadingMessages.length]);
        i++;
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleUpload = (type: 'IDENTITY' | 'POSE') => (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'IDENTITY') setImageA(result);
      else setImageB(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSynthesize = async () => {
    if (!imageA || !imageB) return;

    const hasKey = await (window as any).aistudio?.hasSelectedApiKey?.();
    if (!hasKey) {
      await (window as any).aistudio?.openSelectKey?.();
    }

    setStatus(SynthesisStatus.PROCESSING);
    setError(null);
    setResult(null);

    try {
      const generatedUrl = await synthesizeImages(imageA, imageB);
      setResult(generatedUrl);
      setStatus(SynthesisStatus.SUCCESS);
    } catch (err: any) {
      if (err.message === 'API_KEY_INVALID') {
        setError("Please provide a valid API key to continue.");
        await (window as any).aistudio?.openSelectKey?.();
      } else {
        setError("The synthesis could not be completed at this time.");
      }
      setStatus(SynthesisStatus.ERROR);
    }
  };

  const reset = () => {
    setResult(null);
    setStatus(SynthesisStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#fdfcf0]">
      {/* Subtle Organic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute top-20 left-[5%] w-64 h-64 bg-stone-200 rounded-full blur-3xl floating" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-40 right-[10%] w-96 h-96 bg-stone-100 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-stone-100 rounded-full opacity-30"></div>
      </div>

      <VFXHeader />

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-12 space-y-16 relative z-10">
        {(status === SynthesisStatus.IDLE || status === SynthesisStatus.ERROR) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 animate-fadeIn">
            <ImageSlot 
              label="Source Identity"
              description="The essence of the subject"
              type="IDENTITY"
              image={imageA}
              onUpload={handleUpload('IDENTITY')}
              onClear={() => setImageA(null)}
            />
            <ImageSlot 
              label="Target Pose"
              description="The grace of the movement"
              type="POSE"
              image={imageB}
              onUpload={handleUpload('POSE')}
              onClear={() => setImageB(null)}
            />
          </div>
        )}

        {status === SynthesisStatus.PROCESSING && (
          <div className="flex flex-col items-center justify-center py-32 space-y-12">
            <div className="relative">
               <div className="w-24 h-24 rounded-full border border-stone-200 border-t-stone-800 animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-stone-800 rounded-full animate-pulse"></div>
               </div>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-4xl serif italic text-stone-800 font-light">{loadingMessage}</h2>
              <p className="text-stone-400 text-sm tracking-[0.3em] uppercase">Refining the organic synthesis</p>
            </div>
          </div>
        )}

        {status === SynthesisStatus.SUCCESS && result && (
          <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-stone-100 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-stone-800 px-8 py-2 rounded-full shadow-lg">
                <span className="text-white text-[10px] uppercase tracking-[0.4em] font-medium">Synthesized Result</span>
              </div>
              <img src={result} alt="Result" className="w-full aspect-square object-cover rounded-[1.5rem] grayscale-[10%]" />
            </div>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <button 
                onClick={reset}
                className="w-full md:w-auto px-12 py-5 rounded-full bg-transparent text-stone-500 serif italic text-lg border border-stone-200 hover:bg-stone-50 transition-all"
              >
                New Composition
              </button>
              <a 
                href={result} 
                download="synthesis-output.png"
                className="w-full md:w-auto px-12 py-5 rounded-full bg-stone-800 text-white serif text-lg hover:bg-stone-900 transition-all shadow-xl shadow-stone-200 flex items-center justify-center space-x-3"
              >
                <i className="fas fa-download text-sm opacity-60"></i>
                <span>Export Portrait</span>
              </a>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-xl mx-auto p-12 bg-white border border-stone-100 rounded-[2rem] text-center shadow-sm animate-fadeIn">
            <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-exclamation text-stone-300"></i>
            </div>
            <h3 className="serif text-stone-800 text-2xl font-light mb-4">Synthesis Interrupted</h3>
            <p className="text-stone-400 text-sm leading-relaxed">{error}</p>
          </div>
        )}
      </main>

      {(status === SynthesisStatus.IDLE) && (
        <footer className="p-16 flex flex-col items-center sticky bottom-0 bg-gradient-to-t from-[#fdfcf0] via-[#fdfcf0]/90 to-transparent z-50">
          <button
            disabled={!imageA || !imageB}
            onClick={handleSynthesize}
            className={`
              relative px-20 py-6 rounded-full serif text-xl font-light tracking-[0.2em] transition-all duration-700
              ${imageA && imageB 
                ? 'bg-stone-800 text-white hover:px-24 shadow-2xl shadow-stone-300' 
                : 'bg-white text-stone-200 border border-stone-100 cursor-not-allowed'}
            `}
          >
            <span className="relative z-10 flex items-center space-x-6">
              <i className="fas fa-leaf opacity-40"></i>
              <span className="uppercase">Begin Synthesis</span>
            </span>
          </button>
          {(!imageA || !imageB) && (
            <p className="text-[9px] text-stone-300 mt-6 uppercase tracking-[0.5em]">Select both images to proceed</p>
          )}
        </footer>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
