
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Shield, Zap, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { analyzeMessage, AIAnalysisResult } from '@/utils/aiService';
import { toast } from "sonner";

interface AIAnalysisProps {
  message: string;
  onOptimizedMessage: (message: string) => void;
}

export const AIAnalysis = ({ message, onOptimizedMessage }: AIAnalysisProps) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message to analyze.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeMessage(message);
      setAnalysis(result);
      toast.success("AI analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze message. Please try again.");
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyOptimization = () => {
    if (analysis?.optimization.suggestedMessage) {
      onOptimizedMessage(analysis.optimization.suggestedMessage);
      toast.success("Optimized message applied!");
    }
  };

  const getSecurityColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getSecurityBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "Excellent", className: "bg-green-600" };
    if (score >= 60) return { variant: "secondary" as const, text: "Good", className: "bg-yellow-600" };
    return { variant: "destructive" as const, text: "Needs Improvement" };
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-400" />
          AI Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleAnalyze}
          disabled={isAnalyzing || !message.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Message...
            </>
          ) : (
            <>
              <Bot className="h-4 w-4 mr-2" />
              Analyze with AI
            </>
          )}
        </Button>

        {analysis && (
          <div className="space-y-4 animate-fade-in">
            <Tabs defaultValue="security" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">
                  <Shield className="h-4 w-4 mr-1" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="optimization" className="data-[state=active]:bg-blue-600">
                  <Zap className="h-4 w-4 mr-1" />
                  Optimize
                </TabsTrigger>
                <TabsTrigger value="image" className="data-[state=active]:bg-blue-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Image
                </TabsTrigger>
              </TabsList>

              <TabsContent value="security" className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">Security Score</h3>
                    <Badge {...getSecurityBadge(analysis.security.score)}>
                      {getSecurityBadge(analysis.security.score).text}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Progress 
                        value={analysis.security.score} 
                        className="flex-1"
                      />
                      <span className={`font-medium ${getSecurityColor(analysis.security.score)}`}>
                        {analysis.security.score}%
                      </span>
                    </div>

                    {analysis.security.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Recommendations
                        </h4>
                        <ul className="space-y-1">
                          {analysis.security.recommendations.map((rec, index) => (
                            <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.security.vulnerabilities.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-red-400 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Vulnerabilities
                        </h4>
                        <ul className="space-y-1">
                          {analysis.security.vulnerabilities.map((vuln, index) => (
                            <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              {vuln}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="optimization" className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium">Message Optimization</h3>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        {analysis.optimization.compressionRatio}x compressed
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-blue-400 mb-2">Optimized Message:</h4>
                        <div className="bg-slate-800/50 rounded p-3 border border-slate-600">
                          <p className="text-slate-200 text-sm">{analysis.optimization.suggestedMessage}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-blue-400 mb-2">Reasoning:</h4>
                        <p className="text-slate-300 text-sm">{analysis.optimization.reasoning}</p>
                      </div>

                      <Button 
                        onClick={handleApplyOptimization}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Apply Optimization
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium">Image Analysis</h3>
                      <Badge variant="outline" className="border-blue-500 text-blue-400">
                        {analysis.imageAnalysis.suitability}% suitable
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-sm">Capacity:</span>
                        <span className="text-blue-400 font-medium">{analysis.imageAnalysis.capacity}</span>
                      </div>

                      <Progress value={analysis.imageAnalysis.suitability} className="w-full" />

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-blue-400">Recommendations:</h4>
                        <ul className="space-y-1">
                          {analysis.imageAnalysis.recommendations.map((rec, index) => (
                            <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
