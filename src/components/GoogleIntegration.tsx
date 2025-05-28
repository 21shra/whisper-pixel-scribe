
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Cloud, Globe, Shield, Zap, Upload } from 'lucide-react';
import { analyzeImageWithGoogle, translateMessage, analyzeTextWithGoogle, saveToGoogleDrive } from '@/utils/googleServices';
import { toast } from "sonner";

interface GoogleIntegrationProps {
  uploadedImage?: File | null;
  message?: string;
  encodedImageUrl?: string | null;
}

export const GoogleIntegration: React.FC<GoogleIntegrationProps> = ({
  uploadedImage,
  message,
  encodedImageUrl
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const [translationResult, setTranslationResult] = useState<any>(null);
  const [textAnalysis, setTextAnalysis] = useState<any>(null);

  const handleImageAnalysis = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await analyzeImageWithGoogle(uploadedImage);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setImageAnalysis(result);
      toast.success("Image analysis completed!");
    } catch (error) {
      toast.error("Failed to analyze image");
      console.error("Image analysis error:", error);
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setAnalysisProgress(0), 2000);
    }
  };

  const handleTextTranslation = async () => {
    if (!message || !message.trim()) {
      toast.error("Please enter a message first");
      return;
    }

    setIsTranslating(true);
    try {
      const result = await translateMessage(message, 'es'); // Translate to Spanish as example
      setTranslationResult(result);
      toast.success("Translation completed!");
    } catch (error) {
      toast.error("Failed to translate message");
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTextAnalysis = async () => {
    if (!message || !message.trim()) {
      toast.error("Please enter a message first");
      return;
    }

    try {
      const result = await analyzeTextWithGoogle(message);
      setTextAnalysis(result);
      toast.success("Text analysis completed!");
    } catch (error) {
      toast.error("Failed to analyze text");
      console.error("Text analysis error:", error);
    }
  };

  const handleSaveToGoogleDrive = async () => {
    if (!encodedImageUrl) {
      toast.error("Please encode an image first");
      return;
    }

    setIsSaving(true);
    try {
      // Convert data URL to blob
      const response = await fetch(encodedImageUrl);
      const blob = await response.blob();
      
      const result = await saveToGoogleDrive(blob, `steganocrypt_${Date.now()}.png`);
      
      if (result.success) {
        toast.success("Image saved to Google Drive!");
      } else {
        toast.error(result.error || "Failed to save to Google Drive");
      }
    } catch (error) {
      toast.error("Failed to save to Google Drive");
      console.error("Google Drive save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-400" />
          Google AI Integration
        </CardTitle>
        <CardDescription className="text-slate-400">
          Enhance your steganography with Google's AI services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Analysis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              Image Analysis
            </h4>
            <Button
              size="sm"
              onClick={handleImageAnalysis}
              disabled={isAnalyzing || !uploadedImage}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
          
          {isAnalyzing && (
            <Progress value={analysisProgress} className="h-2" />
          )}
          
          {imageAnalysis && (
            <div className="bg-slate-700/50 rounded-lg p-3 space-y-2">
              <div className="flex flex-wrap gap-1">
                {imageAnalysis.labels.map((label: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-slate-300">
                Safety: {imageAnalysis.safeSearch.adult === 'VERY_UNLIKELY' ? '✅ Safe' : '⚠️ Review needed'}
              </p>
            </div>
          )}
        </div>

        {/* Text Translation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-400" />
              Translation
            </h4>
            <Button
              size="sm"
              onClick={handleTextTranslation}
              disabled={isTranslating || !message}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isTranslating ? "Translating..." : "Translate"}
            </Button>
          </div>
          
          {translationResult && (
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-xs text-slate-300 mb-1">Spanish Translation:</p>
              <p className="text-sm text-white">{translationResult.translatedText}</p>
              <p className="text-xs text-slate-400 mt-1">
                Confidence: {(translationResult.confidence * 100).toFixed(1)}%
              </p>
            </div>
          )}
        </div>

        {/* Text Analysis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              Text Analysis
            </h4>
            <Button
              size="sm"
              onClick={handleTextAnalysis}
              disabled={!message}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Analyze Text
            </Button>
          </div>
          
          {textAnalysis && (
            <div className="bg-slate-700/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={textAnalysis.safetyRating === 'SAFE' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {textAnalysis.safetyRating}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {textAnalysis.sentiment}
                </Badge>
              </div>
              {textAnalysis.recommendations.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-300">Recommendations:</p>
                  {textAnalysis.recommendations.map((rec: string, index: number) => (
                    <p key={index} className="text-xs text-slate-400">• {rec}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Google Drive Save */}
        <div className="space-y-3 pt-2 border-t border-slate-600">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Cloud className="h-4 w-4 text-green-400" />
              Save to Drive
            </h4>
            <Button
              size="sm"
              onClick={handleSaveToGoogleDrive}
              disabled={isSaving || !encodedImageUrl}
              className="bg-green-600 hover:bg-green-700"
            >
              <Upload className="h-3 w-3 mr-1" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
