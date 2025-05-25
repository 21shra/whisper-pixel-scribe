
import React, { useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

export const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageUpload(imageFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card 
      className="border-2 border-dashed border-slate-600 bg-slate-800/30 hover:bg-slate-800/50 
                 transition-all duration-300 cursor-pointer hover:border-blue-500 group"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 rounded-full bg-slate-700 group-hover:bg-blue-600/20 transition-colors">
            <ImageIcon className="h-8 w-8 text-slate-400 group-hover:text-blue-400" />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-white">
              Upload Image
            </p>
            <p className="text-sm text-slate-400">
              Drag and drop an image here, or click to browse
            </p>
            <p className="text-xs text-slate-500">
              Supports PNG, JPG, JPEG formats
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-blue-400">
            <Upload className="h-4 w-4" />
            <span className="text-sm font-medium">Choose File</span>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </Card>
  );
};
