// src/context/ChatContext.jsx
import React, { createContext, useState, useCallback } from 'react';
import { sendMessage as sendAiMessage, getConversationHistory, createConversation } from '../services/aiService';
import { analyticsService } from '../services/analyticsService';

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  // Valores Hardcoded para la prueba solicitada:
  const AGENT_ID_TEST = "b0000000-0000-0000-0000-000000000001";
  const ORG_ID_TEST = "a0000000-0000-0000-0000-000000000001";

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

      // Aseguramos de tener un conversationId o crear una nueva conversacion
      let activeConversationId = conversationId;
      if (!activeConversationId) {
        // En una app real, orgId vendria del usuario logueado en la sesion
        activeConversationId = await createConversation({
          orgId: ORG_ID_TEST,
          agentId: AGENT_ID_TEST,
          customerName: "Invitado Demo",
        });
        setConversationId(activeConversationId);
      }

      // Process message with AI Edge Function
      const response = await sendAiMessage({
        conversationId: activeConversationId,
        message: content,
        agentId: AGENT_ID_TEST
      });

      // Add AI response to the chat
      const aiMessage = {
        id: Date.now() + 1,
        content: response.reply,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Track the interaction
      await analyticsService.trackEvent({
        type: 'message_processed',
        data: {
          conversationId: activeConversationId,
          userMessage: content,
          aiResponse: response.reply,
        },
      });

    } catch (err) {
      setError(err.message || 'Failed to process message. Please try again.');
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