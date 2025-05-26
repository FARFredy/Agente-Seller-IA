// src/context/ChatContext.jsx
import React, { createContext, useState, useCallback } from 'react';
import { aiService } from '../services/aiService';
import { analyticsService } from '../services/analyticsService';

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  const sendMessage = useCallback(async (content) => {
    try {
      setLoading(true);
      setError(null);

      // Add user message to the chat
      const userMessage = {
        id: Date.now(),
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Process message with AI
      const response = await aiService.processMessage(content, conversationId);

      // Add AI response to the chat
      const aiMessage = {
        id: Date.now() + 1,
        content: response.message,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Track the interaction
      await analyticsService.trackEvent({
        type: 'message_processed',
        data: {
          conversationId,
          userMessage: content,
          aiResponse: response.message,
        },
      });

      if (!conversationId) {
        setConversationId(response.conversationId);
      }
    } catch (err) {
      setError('Failed to process message. Please try again.');
      console.error('Message processing error:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        error,
        conversationId,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}