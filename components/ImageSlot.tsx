
import React from 'react';

interface ImageSlotProps {
  label: string;
  description: string;
  type: 'IDENTITY' | 'POSE';
  image: string | null;
  onUpload: (file: File) => void;
  onClear: () => void;
}

const ImageSlot: React.FC<ImageSlotProps> = ({ label, description, type, image, onUpload, onClear }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const accentColor = type === 'IDENTITY' ? 'text-stone-400' : 'text-stone-500';
  const borderColor = type === 'IDENTITY' ? 'border-stone-100' : 'border-stone-200';
  const iconClass = type === 'IDENTITY' ? 'fa-user-circle' : 'fa-person-walking';

  return (
    <div className={`relative flex flex-col h-full bg-white/80 backdrop-blur-sm rounded-[1.5rem] border border-stone-100 shadow-sm transition-all duration-700 overflow-hidden group hover:shadow-md`}>
      <div className="p-8 flex flex-col items-center border-b border-stone-50 bg-stone-50/20">
        <h3 className="text-xl font-light serif text-stone-800 tracking-wider uppercase">{label}</h3>
        <p className="text-xs serif italic text-stone-400 mt-1">{description}</p>
      </div>

      <div className="flex-1 relative flex items-center justify-center min-h-[400px] bg-transparent p-6">
        {image ? (
          <div className="w-full h-full rounded-[1rem] overflow-hidden relative border border-stone-50">
            <img src={image} alt={label} className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000" />
            <button 
              onClick={onClear}
              className="absolute top-6 right-6 bg-white/90 hover:bg-stone-800 hover:text-white text-stone-400 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center space-y-8 group/btn transition-all"
          >
            <div className={`w-28 h-28 rounded-full border border-stone-200 flex items-center justify-center bg-stone-50/30 relative group-hover/btn:border-stone-400 transition-colors`}>
              <i className={`fas ${iconClass} text-4xl ${accentColor} opacity-40 group-hover/btn:opacity-80 transition-opacity`}></i>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-stone-100">
                <i className="fas fa-plus text-[10px] text-stone-300"></i>
              </div>
            </div>
            <span className="text-xs font-light text-stone-400 tracking-[0.3em] uppercase">Select Image</span>
          </button>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
      
      {/* Subtle decorative elements */}
      <div className="absolute top-4 left-4 w-1 h-1 bg-stone-200 rounded-full opacity-40"></div>
      <div className="absolute top-4 right-4 w-1 h-1 bg-stone-200 rounded-full opacity-40"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-stone-200 rounded-full opacity-40"></div>
      <div className="absolute bottom-4 right-4 w-1 h-1 bg-stone-200 rounded-full opacity-40"></div>
    </div>
  );
};

export default ImageSlot;
