// src/utils/constants.js
export const AUTH_CONSTANTS = {
  TOKEN_KEY: 'token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user',
};

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  AI_PROCESS: '/ai/process',
  AI_PERFORMANCE: '/ai/performance',
  ANALYTICS: '/analytics',
  ANALYTICS_EVENT: '/analytics/event',
  WORDPRESS_INTEGRATION: '/integration/wordpress',
};

export const AI_MODELS = {
  GPT4: 'gpt-4',
  GPT35_TURBO: 'gpt-3.5-turbo',
};

export const CHAT_CONSTANTS = {
  MAX_MESSAGES: 100,
  MESSAGE_TYPES: {
    USER: 'user',
    AI: 'ai',
    SYSTEM: 'system',
  },
  DEFAULT_AI_NAME: 'AI Assistant',
};

export const ERROR_MESSAGES = {
  AUTHENTICATION_FAILED: 'Authentication failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  MESSAGE_FAILED: 'Failed to send message. Please try again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

export const ANALYTICS_EVENTS = {
  MESSAGE_SENT: 'message_sent',
  MESSAGE_RECEIVED: 'message_received',
  CONVERSATION_STARTED: 'conversation_started',
  CONVERSATION_ENDED: 'conversation_ended',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  INTEGRATION_SETUP: 'integration_setup',
};

export const INTEGRATION_TYPES = {
  WORDPRESS: 'wordpress',
  WOOCOMMERCE: 'woocommerce',
  SHOPIFY: 'shopify',
  CUSTOM: 'custom',
};