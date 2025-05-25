
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ImagePreviewProps {
  file: File;
  title: string;
}

export const ImagePreview = ({ file, title }: ImagePreviewProps) => {
  const imageUrl = URL.createObjectURL(file);

  return (
    <Card className="bg-slate-700/30 border-slate-600">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-300">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <img 
            src={imageUrl} 
            alt="Preview" 
            className="w-full rounded-lg border border-slate-600 max-h-64 object-contain bg-slate-800"
          />
          <div className="text-xs text-slate-400 space-y-1">
            <p><span className="font-medium">Name:</span> {file.name}</p>
            <p><span className="font-medium">Size:</span> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><span className="font-medium">Type:</span> {file.type}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
