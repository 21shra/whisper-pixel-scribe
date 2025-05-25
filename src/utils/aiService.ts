
export interface AIAnalysisResult {
  security: {
    score: number;
    recommendations: string[];
    vulnerabilities: string[];
  };
  optimization: {
    suggestedMessage: string;
    compressionRatio: number;
    reasoning: string;
  };
  imageAnalysis: {
    suitability: number;
    recommendations: string[];
    capacity: string;
  };
}

export interface AIAssistantResponse {
  message: string;
  suggestions: string[];
  tips: string[];
}

// Mock AI service - In production, this would connect to OpenAI, Claude, etc.
export const analyzeMessage = async (message: string): Promise<AIAnalysisResult> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const wordCount = message.split(' ').length;
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(message);
  const hasNumbers = /\d/.test(message);

  return {
    security: {
      score: Math.min(95, 60 + (hasSpecialChars ? 15 : 0) + (hasNumbers ? 10 : 0) + Math.min(wordCount * 2, 20)),
      recommendations: [
        ...(message.length < 20 ? ["Consider adding more content to make detection harder"] : []),
        ...(wordCount < 5 ? ["Use complete sentences for better disguise"] : []),
        ...(!hasSpecialChars ? ["Add punctuation to make message more natural"] : []),
        "Consider using common phrases to blend with normal text"
      ],
      vulnerabilities: [
        ...(message.toLowerCase().includes('secret') ? ["Avoid using words like 'secret' or 'hidden'"] : []),
        ...(message.length > 500 ? ["Very long messages may be more detectable"] : [])
      ]
    },
    optimization: {
      suggestedMessage: optimizeMessage(message),
      compressionRatio: Math.round((message.length / Math.max(optimizeMessage(message).length, 1)) * 100) / 100,
      reasoning: "Optimized for better steganographic properties while maintaining meaning"
    },
    imageAnalysis: {
      suitability: Math.floor(Math.random() * 40) + 60,
      recommendations: [
        "Use images with rich textures for better hiding capacity",
        "Avoid images with large solid color areas",
        "Higher resolution images provide more hiding space"
      ],
      capacity: `~${Math.floor(message.length * 1.5)}KB available`
    }
  };
};

export const getAIAssistance = async (context: string, userQuery: string): Promise<AIAssistantResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const responses = {
    security: {
      message: "I can help you improve the security of your hidden message. Consider using everyday language and avoiding suspicious keywords.",
      suggestions: [
        "Use common phrases and natural language",
        "Avoid words like 'secret', 'hidden', or 'confidential'",
        "Mix your message with normal conversation",
        "Consider using code words or references only you understand"
      ],
      tips: [
        "Longer messages are harder to detect statistically",
        "Use proper grammar and punctuation",
        "Test with different image types for best results"
      ]
    },
    optimization: {
      message: "Let me help you optimize your message for better steganographic performance while maintaining its meaning.",
      suggestions: [
        "Remove unnecessary words to reduce size",
        "Use abbreviations where appropriate",
        "Consider synonyms that are shorter",
        "Structure sentences for better compression"
      ],
      tips: [
        "Shorter messages hide faster and more securely",
        "Simple sentence structures work best",
        "Avoid repetitive phrases"
      ]
    },
    general: {
      message: "I'm here to help you with steganography best practices. What would you like to know?",
      suggestions: [
        "How to choose the best images for hiding messages",
        "Security tips for steganographic communication",
        "How to optimize message content",
        "Understanding detection risks and mitigation"
      ],
      tips: [
        "Always test your hidden messages before sharing",
        "Use high-quality images for better results",
        "Keep backup copies of your original images"
      ]
    }
  };

  const contextKey = context.toLowerCase().includes('security') ? 'security' :
                    context.toLowerCase().includes('optimize') ? 'optimization' : 'general';

  return responses[contextKey];
};

const optimizeMessage = (message: string): string => {
  return message
    .replace(/\s+/g, ' ')
    .replace(/\b(very|really|quite|rather)\s+/gi, '')
    .replace(/\b(that|which)\s+/gi, '')
    .trim();
};

export const generateMessageSuggestions = (topic: string): string[] => {
  const suggestions = {
    business: [
      "Meeting scheduled for tomorrow at 3 PM in conference room B.",
      "Project deadline moved to next Friday. Please update your timelines.",
      "New client presentation went well. Expecting positive feedback soon."
    ],
    personal: [
      "Hope you're having a great day! Let's catch up soon.",
      "Thanks for the recommendation. I really enjoyed the book.",
      "Family dinner this Sunday at 6 PM. Hope you can make it."
    ],
    casual: [
      "Just finished watching that movie you recommended. It was amazing!",
      "The weather is perfect for a walk in the park today.",
      "Coffee at our usual place tomorrow morning?"
    ]
  };

  return suggestions[topic as keyof typeof suggestions] || suggestions.casual;
};
