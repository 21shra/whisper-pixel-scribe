
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MessageInput = ({ value, onChange, placeholder }: MessageInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="message" className="text-white flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-blue-400" />
        Secret Message
      </Label>
      <Textarea
        id="message"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] bg-slate-700/50 border-slate-600 text-white 
                   placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20
                   resize-none"
        maxLength={1000}
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>Enter the message you want to hide</span>
        <span>{value.length}/1000</span>
      </div>
    </div>
  );
};
