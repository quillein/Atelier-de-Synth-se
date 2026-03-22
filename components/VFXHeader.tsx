
import React from 'react';

const VFXHeader: React.FC = () => {
  return (
    <header className="py-12 px-8 flex flex-col items-center justify-center space-y-4 bg-transparent relative z-50">
      <div className="flex items-center space-x-6">
        <div className="w-16 h-[1px] bg-stone-200 hidden md:block"></div>
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-3">
            <i className="fas fa-leaf text-stone-400 text-xl opacity-60"></i>
            <h1 className="text-4xl font-light tracking-[0.2em] text-stone-800 serif uppercase">Atelier de Synthèse</h1>
            <i className="fas fa-circle text-stone-300 text-[6px]"></i>
          </div>
          <p className="text-sm text-stone-500 serif italic tracking-widest mt-2">L'harmonie de l'identité et de la grâce</p>
        </div>
        <div className="w-16 h-[1px] bg-stone-200 hidden md:block"></div>
      </div>
      <div className="flex items-center space-x-4 pt-2">
        <div className="px-6 py-1.5 bg-white/40 border border-stone-100 rounded-full text-[9px] uppercase tracking-[0.4em] text-stone-400 backdrop-blur-sm">
          Minimal Engine v2.5
        </div>
      </div>
    </header>
  );
};

export default VFXHeader;
