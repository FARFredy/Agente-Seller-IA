// src/services/analyticsService.js
const API_URL = 'http://localhost:3001/api';

export const analyticsService = {
  async getAnalytics(startDate, endDate) {
    try {
      const response = await fetch(
        `${API_URL}/analytics?start=${startDate}&end=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Analytics error:', error);
      throw error;
    }
  },

  async trackEvent(eventData) {
    try {
      const response = await fetch(`${API_URL}/analytics/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to track event');
      }

      return await response.json();
    } catch (error) {
      console.error('Event tracking error:', error);
      throw error;
    }
  },
};