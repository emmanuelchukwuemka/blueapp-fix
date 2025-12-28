import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../config';
import endpoints from '../config/apiEndpoints';

const BASE_URL = API_CONFIG.BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Method to get the stored token
  async getToken() {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Method to set the token
  async setToken(token) {
    try {
      await AsyncStorage.setItem('accessToken', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  // Method to remove the token
  async removeToken() {
    try {
      await AsyncStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  // Generic request method with timeout and error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Get token if not provided in options
    const token = options.token || await this.getToken();

    const config = {
      method: options.method || 'GET',
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Sending request with token:', token.substring(0, 10) + '...');
    } else {
      console.log('No token found for authenticated request');
    }

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout: Server took too long to respond.'));
      }, 30000); // 30 seconds timeout
    });

    try {
      console.log('Making API request to:', url); // Debug logging
      console.log('Request config:', { method: config.method, headers: config.headers }); // Additional debug logging

      // Race the fetch request against the timeout
      const response = await Promise.race([
        fetch(url, config),
        timeoutPromise
      ]);

      console.log('Response received:', response.status); // Debug logging

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Response error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data); // Debug logging

      // If the response is not ok (status code 4xx or 5xx)
      if (!response.ok) {
        // If it's a 401 Unauthorized error, remove the token
        if (response.status === 401) {
          await this.removeToken();
          console.log('Unauthorized access - token removed');
        }
        
        // Log more detailed error information
        console.log('API Error Details:', {
          url,
          method: config.method,
          status: response.status,
          statusText: response.statusText,
          data: data
        });

        throw new Error(data.message || `HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      console.error('Error details:', {
        url,
        method: config.method,
        status: error.status,
        message: error.message,
        errorType: error.constructor.name
      });

      // Provide more specific error messages
      if (error.message.includes('timeout')) {
        throw new Error('Request timeout: Server took too long to respond. Please check your internet connection and try again.');
      } else if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection and server availability. The server may be down or the URL may be incorrect.');
      }

      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    // Note: Using register endpoint instead of signup as per server expectation
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request(endpoints.endpoints.authentication.login.url, {
      method: endpoints.endpoints.authentication.login.method,
      body: JSON.stringify(credentials),
    });
  }

  async forgotPassword(emailData) {
    return this.request(endpoints.endpoints.authentication.forgotPassword.url, {
      method: endpoints.endpoints.authentication.forgotPassword.method,
      body: JSON.stringify(emailData),
    });
  }

  async resetPassword(resetData) {
    return this.request(endpoints.endpoints.authentication.resetPassword.url, {
      method: endpoints.endpoints.authentication.resetPassword.method,
      body: JSON.stringify(resetData),
    });
  }

  // User profile methods
  async getProfile() {
    // Note: Using auth/profile endpoint instead of users/profile as per server expectation
    return this.request('/auth/profile', {
      method: 'GET',
    });
  }

  async updateProfile(profileData) {
    // Only send profile data without the image to the server
    return this.request(endpoints.endpoints.user.updateProfile.url, {
      method: endpoints.endpoints.user.updateProfile.method,
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    // Note: changePassword endpoint is not defined in the JSON, using the original endpoint
    return this.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  // Points methods
  async getPointsBalance() {
    return this.request(endpoints.endpoints.points.getBalance.url, {
      method: endpoints.endpoints.points.getBalance.method,
    });
  }

  async withdrawPoints(withdrawalData) {
    // Note: withdraw endpoint is not defined in the JSON, using the original endpoint
    return this.request('/points/withdraw', {
      method: 'POST',
      body: JSON.stringify(withdrawalData),
    });
  }

  async convertPoints(pointsData) {
    // Note: convert endpoint is not defined in the JSON, using the original endpoint
    return this.request('/points/convert', {
      method: 'POST',
      body: JSON.stringify(pointsData),
    });
  }

  // Reward codes methods
  async redeemCode(codeData) {
    return this.request(endpoints.endpoints.codes.redeemCode.url, {
      method: endpoints.endpoints.codes.redeemCode.method,
      body: JSON.stringify(codeData),
    });
  }

  async validateCode(code) {
    // Note: validate endpoint is not defined in the JSON, using the original endpoint
    return this.request(`/codes/validate/${code}`, {
      method: 'GET',
    });
  }

  async getCodeHistory(params = {}) {
    // Note: history endpoint is not defined in the JSON, using the original endpoint
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(`/codes/history${queryString}`, {
      method: 'GET',
    });
  }

  // Tasks methods
  async getTasks(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.tasks.getTasks.url + queryString, {
      method: endpoints.endpoints.tasks.getTasks.method,
    });
  }

  async startTask(taskId) {
    const endpoint = endpoints.endpoints.tasks.startTask.url.replace('{task_id}', taskId);
    return this.request(endpoint, {
      method: endpoints.endpoints.tasks.startTask.method,
    });
  }

  async completeTask(taskId) {
    const endpoint = endpoints.endpoints.tasks.completeTask.url.replace('{task_id}', taskId);
    return this.request(endpoint, {
      method: endpoints.endpoints.tasks.completeTask.method,
    });
  }

  async uploadDailyCodes(codesData) {
    // Note: upload-daily-codes endpoint is not defined in the JSON, using the original endpoint
    return this.request('/tasks/daily/upload-codes', {
      method: 'POST',
      body: JSON.stringify(codesData),
    });
  }

  // Transactions methods
  async getTransactionHistory(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.transactions.getHistory.url + queryString, {
      method: endpoints.endpoints.transactions.getHistory.method,
    });
  }

  async getTransaction(transactionId) {
    // Note: get single transaction endpoint is not defined in the JSON, using the original endpoint
    return this.request(`/transactions/${transactionId}`, {
      method: 'GET',
    });
  }

  async getTransactionSummary() {
    // Note: transaction summary endpoint is not defined in the JSON, using the original endpoint
    return this.request('/transactions/summary', {
      method: 'GET',
    });
  }

  // Referrals methods
  async getReferralStats() {
    // Note: referral stats endpoint is not defined in the JSON, using the original endpoint
    return this.request('/referrals/stats', {
      method: 'GET',
    });
  }

  async getReferredUsers(params = {}) {
    // Note: referred users endpoint is not defined in the JSON, using the original endpoint
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(`/referrals/users${queryString}`, {
      method: 'GET',
    });
  }

  async getReferralLink() {
    // Note: referral link endpoint is not defined in the JSON, using the original endpoint
    return this.request('/referrals/link', {
      method: 'GET',
    });
  }

  // Notifications methods
  async getNotifications(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.notifications.getNotifications.url + queryString, {
      method: endpoints.endpoints.notifications.getNotifications.method,
    });
  }

  async markNotificationAsRead(notificationId) {
    // Note: mark notification as read endpoint is not defined in the JSON, using the original endpoint
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    // Note: mark all notifications as read endpoint is not defined in the JSON, using the original endpoint
    return this.request('/notifications/mark-all-read', {
      method: 'PUT',
    });
  }

  async getUnreadNotificationCount() {
    // Note: unread notification count endpoint is not defined in the JSON, using the original endpoint
    return this.request('/notifications/unread-count', {
      method: 'GET',
    });
  }

  // Support methods
  async createSupportTicket(ticketData) {
    return this.request(endpoints.endpoints.support.createTicket.url, {
      method: endpoints.endpoints.support.createTicket.method,
      body: JSON.stringify(ticketData),
    });
  }

  async getSupportMessages(params = {}) {
    // Note: support messages endpoint is not defined in the JSON, using the original endpoint
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(`/support/${queryString}`, {
      method: 'GET',
    });
  }

  async getSupportMessage(messageId) {
    // Note: get single support message endpoint is not defined in the JSON, using the original endpoint
    return this.request(`/support/${messageId}`, {
      method: 'GET',
    });
  }

  async getWhatsAppSupport() {
    // Note: WhatsApp support endpoint is not defined in the JSON, using the original endpoint
    return this.request('/support/whatsapp', {
      method: 'GET',
    });
  }

  // Partner methods
  async getPartnerStats() {
    // Note: partner stats endpoint is not defined in the JSON, using the original endpoint
    return this.request('/partners/stats', {
      method: 'GET',
    });
  }

  async getPartnerReferrals(params = {}) {
    // Note: partner referrals endpoint is not defined in the JSON, using the original endpoint
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(`/partners/referrals${queryString}`, {
      method: 'GET',
    });
  }

  async getPartnerCommissionRates() {
    // Note: partner commission rates endpoint is not defined in the JSON, using the original endpoint
    return this.request('/partners/commission-rates', {
      method: 'GET',
    });
  }
}

// Create a singleton instance
const apiService = new ApiService();
export default apiService;