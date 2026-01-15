
import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-xl transition-all duration-500">
      <div className="relative">
        {/* Animated Rings */}
        <div className="w-24 h-24 border-4 border-blue-500/20 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 w-24 h-24 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        
        {/* Magic Sparkles Decoration */}
        <div className="absolute -top-4 -right-4 animate-bounce delay-75">
          <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/></svg>
        </div>
      </div>
      
      <div className="mt-8 text-center px-6">
        <h3 className="text-2xl font-bold text-white mb-2 font-serif">Working the Magic...</h3>
        <p className="text-slate-400 max-w-xs mx-auto animate-pulse">{message}</p>
      </div>
      
      <div className="mt-12 flex gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};
