// src/services/aiService.js
const API_URL = 'http://localhost:3001/api';

export const aiService = {
  async processMessage(message, conversationId) {
    try {
      const response = await fetch(`${API_URL}/ai/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          message,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process message');
      }

      return await response.json();
    } catch (error) {
      console.error('AI processing error:', error);
      throw error;
    }
  },

  async getModelPerformance() {
    try {
      const response = await fetch(`${API_URL}/ai/performance`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get model performance');
      }

      return await response.json();
    } catch (error) {
      console.error('Performance metrics error:', error);
      throw error;
    }
  },
};