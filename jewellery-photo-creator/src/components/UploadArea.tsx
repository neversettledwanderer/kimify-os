import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useAppStore } from '../store';
import { cn } from '../lib/utils';

export function UploadArea() {
  const setSourceImage = useAppStore((state) => state.setSourceImage);
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/jpeg') || file.type.startsWith('image/png')) {
        setSourceImage(file);
      } else {
        alert('Please upload a JPEG or PNG image.');
      }
    }
  }, [setSourceImage]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSourceImage(e.target.files[0]);
    }
  }, [setSourceImage]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl font-light tracking-tight text-premium-900 mb-4">
          Jewellery Photo Creator
        </h1>
        <p className="text-lg text-premium-600 font-light">
          Transform raw product photos into luxury catalogue visuals, editorial shots, and social campaigns using AI.
        </p>
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "w-full max-w-3xl aspect-[16/9] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-200 cursor-pointer bg-white group",
          isDragging ? "border-premium-900 bg-premium-50" : "border-premium-300 hover:border-premium-500 hover:bg-premium-50"
        )}
      >
        <div className="bg-premium-100 p-4 rounded-full mb-4 group-hover:scale-105 transition-transform">
          <UploadCloud className="w-8 h-8 text-premium-700" />
        </div>
        <h3 className="text-xl font-medium text-premium-900 mb-2">Upload a product photo</h3>
        <p className="text-premium-600 mb-6 text-center max-w-md">
          Start with a clean JPEG or PNG on a white or simple background for best results.
        </p>
        
        <label className="relative cursor-pointer bg-premium-900 hover:bg-premium-950 text-white px-8 py-3 rounded-full font-medium transition-colors">
          <span>Choose File</span>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/jpeg, image/png"
            onChange={onFileChange}
          />
        </label>
        <p className="text-sm text-premium-500 mt-4 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Supports JPG, PNG
        </p>
      </div>
    </div>
  );
}
