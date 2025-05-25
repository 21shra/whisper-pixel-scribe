
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from '@/components/ImageUpload';
import { MessageInput } from '@/components/MessageInput';
import { ImagePreview } from '@/components/ImagePreview';
import { Button } from "@/components/ui/button";
import { Download, Upload, Eye, EyeOff, Shield } from 'lucide-react';
import { encodeMessage, decodeMessage } from '@/utils/steganography';
import { toast } from "sonner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("encode");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [encodedImageUrl, setEncodedImageUrl] = useState<string | null>(null);
  const [decodedMessage, setDecodedMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setEncodedImageUrl(null);
    setDecodedMessage("");
    toast.success("Image uploaded successfully!");
  };

  const handleEncode = async () => {
    if (!uploadedImage || !message.trim()) {
      toast.error("Please upload an image and enter a message to encode.");
      return;
    }

    setIsProcessing(true);
    try {
      const encodedUrl = await encodeMessage(uploadedImage, message);
      setEncodedImageUrl(encodedUrl);
      toast.success("Message encoded successfully!");
    } catch (error) {
      toast.error("Failed to encode message. Please try again.");
      console.error("Encoding error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecode = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image to decode.");
      return;
    }

    setIsProcessing(true);
    try {
      const decoded = await decodeMessage(uploadedImage);
      setDecodedMessage(decoded);
      if (decoded) {
        toast.success("Hidden message found!");
      } else {
        toast.info("No hidden message detected in this image.");
      }
    } catch (error) {
      toast.error("Failed to decode message. Please try again.");
      console.error("Decoding error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!encodedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = encodedImageUrl;
    link.download = 'encoded-image.png';
    link.click();
    toast.success("Image downloaded!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">SteganoCrypt</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Hide secret messages within images using advanced steganography techniques. 
            Your secrets, invisible to the naked eye.
          </p>
        </div>

        {/* Main Interface */}
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800 border-slate-700">
              <TabsTrigger 
                value="encode" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Message
              </TabsTrigger>
              <TabsTrigger 
                value="decode"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
              >
                <Eye className="h-4 w-4 mr-2" />
                Reveal Message
              </TabsTrigger>
            </TabsList>

            <TabsContent value="encode" className="space-y-6 animate-fade-in">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-400" />
                    Encode Secret Message
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Upload an image and enter your secret message to hide it within the image data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImageUpload onImageUpload={handleImageUpload} />
                  
                  {uploadedImage && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <ImagePreview 
                          file={uploadedImage} 
                          title="Original Image"
                        />
                        <MessageInput 
                          value={message}
                          onChange={setMessage}
                          placeholder="Enter your secret message..."
                        />
                        <Button 
                          onClick={handleEncode}
                          disabled={isProcessing || !message.trim()}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          {isProcessing ? "Encoding..." : "Hide Message"}
                        </Button>
                      </div>
                      
                      {encodedImageUrl && (
                        <div className="space-y-4 animate-scale-in">
                          <div className="relative">
                            <img 
                              src={encodedImageUrl} 
                              alt="Encoded" 
                              className="w-full rounded-lg border border-slate-600"
                            />
                            <div className="absolute top-2 right-2">
                              <Button
                                size="sm"
                                onClick={handleDownload}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 text-center">
                            Message successfully hidden! The image looks identical but contains your secret.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="decode" className="space-y-6 animate-fade-in">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-400" />
                    Reveal Hidden Message
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Upload an image that may contain a hidden message to extract the secret data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImageUpload onImageUpload={handleImageUpload} />
                  
                  {uploadedImage && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <ImagePreview 
                          file={uploadedImage} 
                          title="Uploaded Image"
                        />
                        <Button 
                          onClick={handleDecode}
                          disabled={isProcessing}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          {isProcessing ? "Decoding..." : "Reveal Message"}
                        </Button>
                      </div>
                      
                      {decodedMessage && (
                        <div className="space-y-4 animate-scale-in">
                          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                            <h3 className="text-white font-semibold mb-2">Hidden Message:</h3>
                            <p className="text-slate-200 whitespace-pre-wrap break-words">
                              {decodedMessage}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-400">
          <p className="text-sm">
            Steganography • Hide in plain sight • Your secrets are safe
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
