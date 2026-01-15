
import React, { useState, useCallback, useRef } from 'react';
import { colorizeImage } from './services/geminiService';
import { ComparisonSlider } from './components/ComparisonSlider';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ImageData, ProcessingState } from './types';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<ImageData | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    isProcessing: false,
    error: null,
    progressMessage: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate if it's an image
    if (!file.type.startsWith('image/')) {
      setProcessing(prev => ({ ...prev, error: "Please upload a valid image file." }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setSourceImage({
        base64: base64String,
        mimeType: file.type,
        previewUrl: reader.result as string
      });
      setResultImage(null);
      setProcessing(prev => ({ ...prev, error: null }));
    };
    reader.readAsDataURL(file);
  };

  const startColorization = async () => {
    if (!sourceImage) return;

    setProcessing({
      isProcessing: true,
      error: null,
      progressMessage: "Analyzing image structures..."
    });

    try {
      // Simulate progress updates for better UX
      const messages = [
        "Analyzing image structures...",
        "Identifying historical contexts...",
        "Applying deep learning pigments...",
        "Refining skin tones and textures...",
        "Adding natural lighting effects..."
      ];
      
      let msgIndex = 0;
      const interval = setInterval(() => {
        if (msgIndex < messages.length - 1) {
          msgIndex++;
          setProcessing(p => ({ ...p, progressMessage: messages[msgIndex] }));
        }
      }, 2000);

      const colorized = await colorizeImage(sourceImage.base64, sourceImage.mimeType);
      
      clearInterval(interval);
      setResultImage(colorized);
      setProcessing({ isProcessing: false, error: null, progressMessage: '' });
    } catch (err: any) {
      setProcessing({
        isProcessing: false,
        error: err.message || "Failed to colorize image. Please try again.",
        progressMessage: ''
      });
    }
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `colorized-photo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setSourceImage(null);
    setResultImage(null);
    setProcessing({ isProcessing: false, error: null, progressMessage: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={reset} style={{ cursor: 'pointer' }}>
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-serif italic">ChromaRevive</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">How it works</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-slate-950 px-4 py-2 rounded-full hover:bg-slate-200 transition-all font-semibold"
            >
              Start New
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        {!sourceImage && (
          <div className="flex flex-col items-center justify-center text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif max-w-4xl leading-tight">
              Breathe New Life into Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Monochrome Memories</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12">
              Our advanced AI model restores natural, vibrant colors to old black and white photographs in seconds. Experience history in a new light.
            </p>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative w-full max-w-lg p-10 md:p-16 border-2 border-dashed border-slate-700 rounded-3xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer bg-slate-900/40"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-blue-600/20 group-hover:text-blue-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Upload Black & White Photo</h3>
                <p className="text-slate-500 text-sm">PNG, JPG or WebP up to 10MB</p>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
              {[
                { title: "Fast Processing", desc: "Results delivered in under 15 seconds" },
                { title: "High Fidelity", desc: "Natural textures and skin tones preserved" },
                { title: "Completely Free", desc: "Infinite colorization with your API key" }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-slate-900/20 rounded-2xl border border-white/5">
                  <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workspace Section */}
        {sourceImage && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {processing.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p>{processing.error}</p>
              </div>
            )}

            {!resultImage ? (
              <div className="flex flex-col items-center gap-10">
                <div className="relative w-full max-w-3xl aspect-video md:aspect-auto md:max-h-[60vh] overflow-hidden rounded-3xl border border-white/10 shadow-2xl group">
                  <img 
                    src={sourceImage.previewUrl} 
                    alt="Source Preview" 
                    className="w-full h-full object-contain bg-slate-900" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-slate-950 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-slate-200 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      Change Image
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <button 
                    onClick={startColorization}
                    className="relative px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-xl transition-all shadow-xl shadow-blue-900/20 group overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Start Colorizing
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                  </button>
                  <p className="text-slate-500 text-sm">Powered by Gemini 2.5 Flash Image AI</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-12">
                <ComparisonSlider 
                  originalUrl={sourceImage.previewUrl} 
                  colorizedUrl={resultImage} 
                />

                <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                  <button 
                    onClick={downloadImage}
                    className="px-8 py-4 bg-white text-slate-950 rounded-full font-bold flex items-center gap-2 hover:bg-slate-200 transition-all shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download Masterpiece
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 bg-slate-800 text-white rounded-full font-bold flex items-center gap-2 hover:bg-slate-700 transition-all border border-white/10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Colorize Another
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input for triggering file picker from anywhere */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center text-slate-600 text-sm">
        <p>© 2024 ChromaRevive AI. Transforming monochrome into vivid reality.</p>
        <p className="mt-2">Made for those who value their history.</p>
      </footer>

      {processing.isProcessing && (
        <LoadingOverlay message={processing.progressMessage} />
      )}
    </div>
  );
};

export default App;
