// src/services/authService.js

// Mock user data for development
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user'
  }
];

// Simulate API delay
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(email, password) {
    try {
      // Simulate network delay
      await simulateDelay();
      
      // Find user by email and password
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Create mock token
      const token = btoa(JSON.stringify({ 
        userId: user.id, 
        email: user.email, 
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      }));

      // Store token
      localStorage.setItem('token', token);
      
      // Return user data (excluding password)
      const { password: _, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      // Simulate network delay
      await simulateDelay();
      
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name || 'New User',
        role: 'user'
      };

      // Create mock token
      const token = btoa(JSON.stringify({ 
        userId: newUser.id, 
        email: newUser.email, 
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      }));

      localStorage.setItem('token', token);
      
      return {
        user: newUser,
        token
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token));
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  },

  getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp <= Date.now()) return null;
      
      const user = MOCK_USERS.find(u => u.id === payload.userId);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    } catch {
      return null;
    }
  }
};
