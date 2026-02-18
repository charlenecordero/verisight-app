
import React, { useRef, useState } from 'react';
import { MediaFile } from '../types';

interface FileUploadProps {
  onFileSelect: (media: MediaFile) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    let type: 'image' | 'video' | 'audio' = 'image';
    if (file.type.startsWith('video')) type = 'video';
    else if (file.type.startsWith('audio')) type = 'audio';

    const reader = new FileReader();
    reader.onload = (e) => {
      onFileSelect({
        file,
        preview: e.target?.result as string,
        type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`relative w-full h-80 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all duration-300 ${
        dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500 bg-zinc-900/50'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !isLoading && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,audio/*"
        disabled={isLoading}
      />
      
      <div className="flex flex-col items-center text-center px-4">
        <div className="flex gap-2 mb-4">
          <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-image text-xl"></i>
          </div>
          <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-music text-xl"></i>
          </div>
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-palette text-xl"></i>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Drop photo, art, or music</h3>
        <p className="text-gray-400 max-w-sm">
          Detect AI in images, digital paintings, or audio tracks. VeriSight supports multi-modal forensics.
        </p>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl z-20 backdrop-blur-sm">
          <div className="flex flex-col items-center">
             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             <span className="mt-4 text-blue-400 font-bold tracking-widest uppercase text-xs">Processing Forensic Signature</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
