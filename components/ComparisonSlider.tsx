
import React, { useState, useRef, useEffect } from 'react';

interface ComparisonSliderProps {
  originalUrl: string;
  colorizedUrl: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ originalUrl, colorizedUrl }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in event 
      ? event.touches[0].clientX - rect.left 
      : (event as React.MouseEvent).clientX - rect.left;
      
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 cursor-col-resize select-none"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* Colorized Image (Background) */}
      <img 
        src={colorizedUrl} 
        alt="Colorized" 
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Original B&W Image (Overlay) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={originalUrl} 
          alt="Original" 
          className="absolute inset-0 w-full h-full object-cover grayscale"
          style={{ width: `${100 / (sliderPosition / 100)}%` }}
        />
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider text-white border border-white/20">
          Original
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider text-white border border-blue-400/20">
        AI Colorized
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute inset-y-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-slate-900 text-slate-900">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
          </svg>
        </div>
      </div>
    </div>
  );
};
