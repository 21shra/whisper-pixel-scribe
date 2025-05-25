
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Shield, Zap, Lightbulb, MessageSquare, Loader2 } from 'lucide-react';
import { getAIAssistance, generateMessageSuggestions, AIAssistantResponse } from '@/utils/aiService';
import { toast } from "sonner";

interface AIAssistantProps {
  onMessageSuggestion: (message: string) => void;
}

export const AIAssistant = ({ onMessageSuggestion }: AIAssistantProps) => {
  const [activeTab, setActiveTab] = useState("chat");
  const [userQuery, setUserQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<AIAssistantResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const handleAskAI = async () => {
    if (!userQuery.trim()) {
      toast.error("Please enter a question for the AI assistant.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await getAIAssistance(activeTab, userQuery);
      setAiResponse(response);
      toast.success("AI analysis complete!");
    } catch (error) {
      toast.error("Failed to get AI assistance. Please try again.");
      console.error("AI assistance error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onMessageSuggestion(suggestion);
    toast.success("Message suggestion applied!");
  };

  const handleTopicSuggestions = (topic: string) => {
    setSelectedTopic(topic);
    const suggestions = generateMessageSuggestions(topic);
    setAiResponse({
      message: `Here are some ${topic} message suggestions:`,
      suggestions,
      tips: [
        "These messages look natural and won't raise suspicion",
        "You can modify them to fit your specific needs",
        "Mix personal details to make them more authentic"
      ]
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-400" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-slate-700">
            <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600">
              <MessageSquare className="h-4 w-4 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">
              <Shield className="h-4 w-4 mr-1" />
              Security
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="data-[state=active]:bg-blue-600">
              <Lightbulb className="h-4 w-4 mr-1" />
              Ideas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <div className="space-y-3">
              <Textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask me anything about steganography, security tips, or message optimization..."
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[80px]"
              />
              <Button 
                onClick={handleAskAI}
                disabled={isLoading || !userQuery.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 mr-2" />
                    Ask AI Assistant
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="space-y-3">
              <p className="text-slate-300 text-sm">Get AI-powered security analysis and recommendations for your steganographic practices.</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAskAI()}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Security Tips
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setUserQuery("How to avoid detection?")}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Avoid Detection
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <div className="space-y-3">
              <p className="text-slate-300 text-sm">Get AI-generated message suggestions that look natural and innocent.</p>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTopicSuggestions('business')}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Business
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTopicSuggestions('personal')}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Personal
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTopicSuggestions('casual')}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Casual
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {aiResponse && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-start gap-3">
                <Bot className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div className="space-y-3 flex-1">
                  <p className="text-slate-200">{aiResponse.message}</p>
                  
                  {aiResponse.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-blue-400">Suggestions:</h4>
                      <div className="space-y-2">
                        {aiResponse.suggestions.map((suggestion, index) => (
                          <div 
                            key={index}
                            className="bg-slate-800/50 rounded p-3 border border-slate-600 hover:border-blue-500 transition-colors cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <p className="text-slate-300 text-sm">{suggestion}</p>
                            <Badge variant="secondary" className="mt-2 bg-blue-600/20 text-blue-300">
                              Click to use
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiResponse.tips.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-green-400">Tips:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {aiResponse.tips.map((tip, index) => (
                          <li key={index} className="text-slate-400 text-sm">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
