// src/services/aiService.js

// Mock AI responses for development
const AI_RESPONSES = [
  "Hello! I'm here to help you with any questions you might have. How can I assist you today?",
  "I understand your concern. Let me help you find the best solution for that.",
  "That's a great question! Based on what you've told me, I'd recommend the following approach:",
  "I can definitely help you with that. Here are a few options to consider:",
  "Thank you for providing that information. Let me analyze this and get back to you with the best recommendations.",
  "I see what you're looking for. Here's what I would suggest in this situation:",
  "That's an interesting challenge. Let me walk you through some potential solutions:",
  "I appreciate you bringing this to my attention. Here's how we can address this:",
  "Based on my analysis, here are the most effective solutions for your needs:",
  "I'm glad you asked! This is something I can definitely help you with."
];

// Simulate processing delay
const simulateDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random conversation ID
const generateConversationId = () => `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const aiService = {
  async processMessage(message, conversationId = null) {
    try {
      // Simulate AI processing time
      await simulateDelay(800 + Math.random() * 1200);
      
      // Generate conversation ID if not provided
      const currentConversationId = conversationId || generateConversationId();
      
      // Select a response based on message content or randomly
      let aiResponse;
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        aiResponse = AI_RESPONSES[0];
      } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
        aiResponse = AI_RESPONSES[1];
      } else if (lowerMessage.includes('question') || lowerMessage.includes('?')) {
        aiResponse = AI_RESPONSES[2];
      } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
        aiResponse = AI_RESPONSES[3];
      } else if (lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
        aiResponse = AI_RESPONSES[7];
      } else {
        // Random response for other messages
        aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      }

      // Add some personalization to the response
      if (message.length > 50) {
        aiResponse += " I can see you've provided detailed information, which helps me give you a more accurate response.";
      }

      return {
        message: aiResponse,
        conversationId: currentConversationId,
        timestamp: new Date().toISOString(),
        confidence: 0.85 + Math.random() * 0.15, // Random confidence between 0.85-1.0
        processingTime: Math.round(800 + Math.random() * 1200) // Mock processing time
      };
    } catch (error) {
      console.error('AI processing error:', error);
      throw new Error('Failed to process your message. Please try again.');
    }
  },

  async getModelPerformance() {
    try {
      // Simulate API delay
      await simulateDelay(500);
      
      // Return mock performance metrics
      return {
        accuracy: 0.92 + Math.random() * 0.07, // 92-99%
        responseTime: Math.round(800 + Math.random() * 400), // 800-1200ms
        satisfaction: 0.87 + Math.random() * 0.12, // 87-99%
        totalMessages: Math.floor(1000 + Math.random() * 9000), // 1k-10k
        successfulResponses: Math.floor(950 + Math.random() * 50), // 95-100%
        lastUpdated: new Date().toISOString(),
        modelVersion: "mock-ai-v1.0",
        uptime: 0.998 + Math.random() * 0.002 // 99.8-100%
      };
    } catch (error) {
      console.error('Performance metrics error:', error);
      throw new Error('Failed to retrieve model performance data.');
    }
  },

  async getConversationHistory(conversationId) {
    try {
      await simulateDelay(300);
      
      // Return mock conversation history
      return {
        conversationId,
        messages: [],
        startTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        messageCount: 0
      };
    } catch (error) {
      console.error('Conversation history error:', error);
      throw new Error('Failed to retrieve conversation history.');
    }
  }
};
