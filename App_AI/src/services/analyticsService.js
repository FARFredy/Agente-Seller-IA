// src/services/analyticsService.js

// Mock analytics data storage
let mockEvents = [];
let mockAnalyticsData = {
  totalMessages: 1247,
  activeUsers: 89,
  averageResponseTime: 1.2,
  customerSatisfaction: 4.6,
  topCategories: [
    { name: 'Technical Support', count: 234, percentage: 45 },
    { name: 'Billing Questions', count: 156, percentage: 30 },
    { name: 'Product Information', count: 89, percentage: 17 },
    { name: 'General Inquiry', count: 42, percentage: 8 }
  ],
  responseTimeMetrics: [
    { time: '09:00', avgTime: 0.8 },
    { time: '12:00', avgTime: 1.2 },
    { time: '15:00', avgTime: 1.5 },
    { time: '18:00', avgTime: 1.1 },
    { time: '21:00', avgTime: 0.9 }
  ],
  dailyMetrics: generateDailyMetrics()
};

// Generate mock daily metrics for the last 30 days
function generateDailyMetrics() {
  const metrics = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    metrics.push({
      date: date.toISOString().split('T')[0],
      messages: Math.floor(20 + Math.random() * 80),
      users: Math.floor(5 + Math.random() * 20),
      satisfaction: 3.5 + Math.random() * 1.5,
      responseTime: 0.5 + Math.random() * 2
    });
  }
  
  return metrics;
}

// Simulate API delay
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsService = {
  async getAnalytics(startDate, endDate) {
    try {
      // Simulate API delay
      await simulateDelay(500 + Math.random() * 500);
      
      // Filter daily metrics by date range if provided
      let filteredMetrics = mockAnalyticsData.dailyMetrics;
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        filteredMetrics = mockAnalyticsData.dailyMetrics.filter(metric => {
          const metricDate = new Date(metric.date);
          return metricDate >= start && metricDate <= end;
        });
      }

      // Calculate aggregated metrics for the filtered period
      const totalMessages = filteredMetrics.reduce((sum, day) => sum + day.messages, 0);
      const totalUsers = filteredMetrics.reduce((sum, day) => sum + day.users, 0);
      const avgSatisfaction = filteredMetrics.reduce((sum, day) => sum + day.satisfaction, 0) / filteredMetrics.length;
      const avgResponseTime = filteredMetrics.reduce((sum, day) => sum + day.responseTime, 0) / filteredMetrics.length;

      return {
        ...mockAnalyticsData,
        totalMessages,
        activeUsers: Math.floor(totalUsers / filteredMetrics.length), // Average daily users
        averageResponseTime: Math.round(avgResponseTime * 10) / 10,
        customerSatisfaction: Math.round(avgSatisfaction * 10) / 10,
        dailyMetrics: filteredMetrics,
        dateRange: {
          start: startDate || filteredMetrics[0]?.date,
          end: endDate || filteredMetrics[filteredMetrics.length - 1]?.date
        },
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Analytics error:', error);
      throw new Error('Failed to fetch analytics data. Please try again.');
    }
  },

  async trackEvent(eventData) {
    try {
      // Simulate API delay
      await simulateDelay(100 + Math.random() * 200);
      
      // Store event in mock storage
      const event = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        ...eventData
      };
      
      mockEvents.push(event);
      
      // Keep only last 1000 events to prevent memory issues
      if (mockEvents.length > 1000) {
        mockEvents = mockEvents.slice(-1000);
      }

      // Update mock analytics data based on tracked events
      if (eventData.type === 'message_processed') {
        mockAnalyticsData.totalMessages++;
      }

      return {
        success: true,
        eventId: event.id,
        timestamp: event.timestamp
      };
    } catch (error) {
      console.error('Event tracking error:', error);
      throw new Error('Failed to track event. Please try again.');
    }
  },

  async getRecentEvents(limit = 50) {
    try {
      await simulateDelay(200);
      
      return {
        events: mockEvents.slice(-limit).reverse(), // Return most recent first
        total: mockEvents.length
      };
    } catch (error) {
      console.error('Recent events error:', error);
      throw new Error('Failed to fetch recent events.');
    }
  },

  async getUserMetrics(userId) {
    try {
      await simulateDelay(300);
      
      // Filter events for specific user
      const userEvents = mockEvents.filter(event => 
        event.data && event.data.userId === userId
      );

      return {
        userId,
        totalSessions: Math.floor(5 + Math.random() * 20),
        totalMessages: userEvents.length,
        averageSessionDuration: Math.round((10 + Math.random() * 50) * 10) / 10, // minutes
        lastActivity: userEvents.length > 0 ? userEvents[userEvents.length - 1].timestamp : null,
        satisfactionRating: 3.5 + Math.random() * 1.5
      };
    } catch (error) {
      console.error('User metrics error:', error);
      throw new Error('Failed to fetch user metrics.');
    }
  }
};
