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
  async request(endpoint, options = {}, params = {}) {
    // Replace URL parameters
    let url = `${this.baseURL}${endpoint}`;
    
    // Replace any {param} in the endpoint with values from params object
    Object.keys(params).forEach(key => {
      url = url.replace(`{${key}}`, params[key]);
    });

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
    return this.request(endpoints.endpoints.authentication.profile.url, {
      method: endpoints.endpoints.authentication.profile.method,
    });
  }

  async updateProfile(profileData) {
    return this.request(endpoints.endpoints.users.updateProfile.url, {
      method: endpoints.endpoints.users.updateProfile.method,
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.request(endpoints.endpoints.users.changePassword.url, {
      method: endpoints.endpoints.users.changePassword.method,
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
    return this.request(endpoints.endpoints.points.withdraw.url, {
      method: endpoints.endpoints.points.withdraw.method,
      body: JSON.stringify(withdrawalData),
    });
  }

  async convertPoints(pointsData) {
    return this.request(endpoints.endpoints.points.convert.url, {
      method: endpoints.endpoints.points.convert.method,
      body: JSON.stringify(pointsData),
    });
  }

  // Reward codes methods
  async redeemCode(codeData) {
    return this.request(endpoints.endpoints.codes.redeemCode.url, {
      method: endpoints.endpoints.codes.redeemCode.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(codeData),
    });
  }

  async validateCode(code) {
    return this.request(endpoints.endpoints.codes.validateCode.url, {
      method: 'GET',
    }, {
      code: code
    });
  }

  async getCodeHistory(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.codes.getHistory.url + queryString, {
      method: endpoints.endpoints.codes.getHistory.method,
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
    return this.request(endpoints.endpoints.tasks.startTask.url, {
      method: endpoints.endpoints.tasks.startTask.method,
    }, {
      task_id: taskId
    });
  }

  async completeTask(taskId) {
    return this.request(endpoints.endpoints.tasks.completeTask.url, {
      method: endpoints.endpoints.tasks.completeTask.method,
    }, {
      task_id: taskId
    });
  }

  async getTaskDetail(taskId) {
    return this.request(endpoints.endpoints.tasks.getTaskDetail.url, {
      method: endpoints.endpoints.tasks.getTaskDetail.method,
    }, {
      task_id: taskId
    });
  }

  async uploadDailyCodes(codesData) {
    return this.request(endpoints.endpoints.tasks.uploadDailyCodes.url, {
      method: endpoints.endpoints.tasks.uploadDailyCodes.method,
      body: JSON.stringify(codesData),
    });
  }

  // History methods
  async getHistory(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.transactions.getHistory.url + queryString, {
      method: endpoints.endpoints.transactions.getHistory.method,
    });
  }

  async getTransaction(transactionId) {
    return this.request(endpoints.endpoints.transactions.getTransaction.url, {
      method: endpoints.endpoints.transactions.getTransaction.method,
    }, {
      transaction_id: transactionId
    });
  }

  async getTransactionSummary() {
    return this.request(endpoints.endpoints.transactions.getSummary.url, {
      method: endpoints.endpoints.transactions.getSummary.method,
    });
  }

  // Referrals methods
  async getReferralStats() {
    return this.request(endpoints.endpoints.referrals.getStats.url, {
      method: endpoints.endpoints.referrals.getStats.method,
    });
  }

  async getReferredUsers(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.referrals.getUsers.url + queryString, {
      method: endpoints.endpoints.referrals.getUsers.method,
    });
  }

  async getReferralLink() {
    return this.request(endpoints.endpoints.referrals.getLink.url, {
      method: endpoints.endpoints.referrals.getLink.method,
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
    return this.request(endpoints.endpoints.notifications.markAsRead.url, {
      method: endpoints.endpoints.notifications.markAsRead.method,
    }, {
      notification_id: notificationId
    });
  }

  async markAllNotificationsAsRead() {
    return this.request(endpoints.endpoints.notifications.markAllAsRead.url, {
      method: endpoints.endpoints.notifications.markAllAsRead.method,
    });
  }

  async getUnreadNotificationCount() {
    return this.request(endpoints.endpoints.notifications.getUnreadCount.url, {
      method: endpoints.endpoints.notifications.getUnreadCount.method,
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
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.support.getMessages.url + queryString, {
      method: endpoints.endpoints.support.getMessages.method,
    });
  }

  async getSupportMessage(messageId) {
    return this.request(endpoints.endpoints.support.getMessage.url, {
      method: endpoints.endpoints.support.getMessage.method,
    }, {
      message_id: messageId
    });
  }

  async getWhatsAppSupport() {
    return this.request(endpoints.endpoints.support.getWhatsAppSupport.url, {
      method: endpoints.endpoints.support.getWhatsAppSupport.method,
    });
  }

  // Authentication methods
  async googleLogin() {
    return this.request(endpoints.endpoints.authentication.google.url, {
      method: endpoints.endpoints.authentication.google.method,
    });
  }

  async appleLogin() {
    return this.request(endpoints.endpoints.authentication.apple.url, {
      method: endpoints.endpoints.authentication.apple.method,
    });
  }

  async googleCallback() {
    return this.request(endpoints.endpoints.authentication.googleCallback.url, {
      method: endpoints.endpoints.authentication.googleCallback.method,
    });
  }

  async appleCallback() {
    return this.request(endpoints.endpoints.authentication.appleCallback.url, {
      method: endpoints.endpoints.authentication.appleCallback.method,
    });
  }

  // User methods
  async getUserProfile() {
    return this.request(endpoints.endpoints.users.getProfile.url, {
      method: endpoints.endpoints.users.getProfile.method,
    });
  }

  async adminUpdateUserRole(userId, roleData) {
    return this.request(endpoints.endpoints.users.adminUpdateRole.url, {
      method: endpoints.endpoints.users.adminUpdateRole.method,
      body: JSON.stringify(roleData),
    }, {
      user_id: userId
    });
  }

  async adminUpdateUserPoints(userId, pointsData) {
    return this.request(endpoints.endpoints.users.adminUpdatePoints.url, {
      method: endpoints.endpoints.users.adminUpdatePoints.method,
      body: JSON.stringify(pointsData),
    }, {
      user_id: userId
    });
  }

  async adminSearchUsers(searchParams = {}) {
    const queryParams = new URLSearchParams(searchParams).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.users.adminSearchUsers.url + queryString, {
      method: endpoints.endpoints.users.adminSearchUsers.method,
    });
  }

  async adminSuspendUser(userId) {
    return this.request(endpoints.endpoints.users.adminSuspendUser.url, {
      method: endpoints.endpoints.users.adminSuspendUser.method,
    }, {
      user_id: userId
    });
  }

  async adminUnsuspendUser(userId) {
    return this.request(endpoints.endpoints.users.adminUnsuspendUser.url, {
      method: endpoints.endpoints.users.adminUnsuspendUser.method,
    }, {
      user_id: userId
    });
  }

  async uploadAvatar(avatarData) {
    return this.request(endpoints.endpoints.users.uploadAvatar.url, {
      method: endpoints.endpoints.users.uploadAvatar.method,
      body: JSON.stringify(avatarData),
    });
  }

  // Code methods
  async getCodeInfo(code) {
    return this.request(endpoints.endpoints.codes.getCodeInfo.url, {
      method: 'GET',
    }, {
      code: code
    });
  }

  async adminGetAllCodes(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.codes.adminGetAll.url + queryString, {
      method: endpoints.endpoints.codes.adminGetAll.method,
    });
  }

  async adminDeleteCode(codeId) {
    return this.request(endpoints.endpoints.codes.adminDelete.url, {
      method: endpoints.endpoints.codes.adminDelete.method,
    }, {
      code_id: codeId
    });
  }

  async adminGetCodeStats() {
    return this.request(endpoints.endpoints.codes.adminStats.url, {
      method: endpoints.endpoints.codes.adminStats.method,
    });
  }

  // Transaction methods
  async adminGetAllTransactions(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.transactions.adminGetAll.url + queryString, {
      method: endpoints.endpoints.transactions.adminGetAll.method,
    });
  }

  async adminUpdateTransactionStatus(transactionId, statusData) {
    return this.request(endpoints.endpoints.transactions.adminUpdateStatus.url, {
      method: endpoints.endpoints.transactions.adminUpdateStatus.method,
      body: JSON.stringify(statusData),
    }, {
      transaction_id: transactionId
    });
  }

  async adminGetUserTransactions(userId, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.transactions.adminGetUserTransactions.url + queryString, {
      method: endpoints.endpoints.transactions.adminGetUserTransactions.method,
    }, {
      user_id: userId
    });
  }

  // Referral methods
  async adminGetAllReferrals(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.referrals.adminGetAll.url + queryString, {
      method: endpoints.endpoints.referrals.adminGetAll.method,
    });
  }

  async adminGetReferralBonuses(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.referrals.adminGetBonuses.url + queryString, {
      method: endpoints.endpoints.referrals.adminGetBonuses.method,
    });
  }

  async adminGetTopReferrers() {
    return this.request(endpoints.endpoints.referrals.adminGetTopReferrers.url, {
      method: endpoints.endpoints.referrals.adminGetTopReferrers.method,
    });
  }

  // Admin methods
  async exportCodes(batchId, exportParams = {}) {
    const queryParams = new URLSearchParams(exportParams).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.admin.exportCodes.url + queryString, {
      method: endpoints.endpoints.admin.exportCodes.method,
    }, {
      batch_id: batchId
    });
  }

  async getRecentBatch() {
    return this.request(endpoints.endpoints.admin.getRecentBatch.url, {
      method: endpoints.endpoints.admin.getRecentBatch.method,
    });
  }

  async deleteCode(codeId) {
    return this.request(endpoints.endpoints.admin.deleteCode.url, {
      method: endpoints.endpoints.admin.deleteCode.method,
    }, {
      code_id: codeId
    });
  }

  async getCodeDetails(code) {
    return this.request(endpoints.endpoints.admin.getCodeDetails.url, {
      method: endpoints.endpoints.admin.getCodeDetails.method,
    }, {
      code: code
    });
  }

  async getSupportMessagesAdmin(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.admin.getSupportMessages.url + queryString, {
      method: endpoints.endpoints.admin.getSupportMessages.method,
    });
  }

  async respondToSupportMessage(messageId, responseData) {
    return this.request(endpoints.endpoints.admin.respondToSupportMessage.url, {
      method: endpoints.endpoints.admin.respondToSupportMessage.method,
      body: JSON.stringify(responseData),
    }, {
      message_id: messageId
    });
  }

  async getRecentActivities(limit) {
    const params = limit ? { limit: limit } : {};
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.admin.getRecentActivities.url + queryString, {
      method: endpoints.endpoints.admin.getRecentActivities.method,
    });
  }

  async updateUserPoints(pointsData) {
    return this.request(endpoints.endpoints.admin.updateUserPoints.url, {
      method: endpoints.endpoints.admin.updateUserPoints.method,
      body: JSON.stringify(pointsData),
    });
  }

  async getUsersAdmin(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.admin.getUsers.url + queryString, {
      method: endpoints.admin.getUsers.method,
    });
  }

  async getUserDetails(userId) {
    return this.request(endpoints.endpoints.admin.getUserDetails.url, {
      method: endpoints.endpoints.admin.getUserDetails.method,
    }, {
      user_id: userId
    });
  }

  async suspendUser(userId) {
    return this.request(endpoints.endpoints.admin.suspendUser.url, {
      method: endpoints.endpoints.admin.suspendUser.method,
    }, {
      user_id: userId
    });
  }

  async unsuspendUser(userId) {
    return this.request(endpoints.endpoints.admin.unsuspendUser.url, {
      method: endpoints.endpoints.admin.unsuspendUser.method,
    }, {
      user_id: userId
    });
  }

  async verifyUser(userId, verifyData = {}) {
    return this.request(endpoints.endpoints.admin.verifyUser.url, {
      method: endpoints.endpoints.admin.verifyUser.method,
      body: JSON.stringify(verifyData),
    }, {
      user_id: userId
    });
  }

  async updateUser(userId, userData) {
    return this.request(endpoints.endpoints.admin.updateUser.url, {
      method: endpoints.endpoints.admin.updateUser.method,
      body: JSON.stringify(userData),
    }, {
      user_id: userId
    });
  }

  async verifyDocuments(userId) {
    return this.request(endpoints.endpoints.admin.verifyDocuments.url, {
      method: endpoints.endpoints.admin.verifyDocuments.method,
    }, {
      user_id: userId
    });
  }

  async messageUser(userId, messageData) {
    return this.request(endpoints.endpoints.admin.messageUser.url, {
      method: endpoints.endpoints.admin.messageUser.method,
      body: JSON.stringify(messageData),
    }, {
      user_id: userId
    });
  }

  async getWithdrawalsAdmin(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.admin.getWithdrawals.url + queryString, {
      method: endpoints.endpoints.admin.getWithdrawals.method,
    });
  }

  async approveWithdrawal(transactionId) {
    return this.request(endpoints.endpoints.admin.approveWithdrawal.url, {
      method: endpoints.endpoints.admin.approveWithdrawal.method,
    }, {
      transaction_id: transactionId
    });
  }

  async rejectWithdrawal(transactionId, reasonData = {}) {
    return this.request(endpoints.endpoints.admin.rejectWithdrawal.url, {
      method: endpoints.endpoints.admin.rejectWithdrawal.method,
      body: JSON.stringify(reasonData),
    }, {
      transaction_id: transactionId
    });
  }

  async awardReferralBonus(bonusData) {
    return this.request(endpoints.endpoints.admin.awardReferralBonus.url, {
      method: endpoints.endpoints.admin.awardReferralBonus.method,
      body: JSON.stringify(bonusData),
    });
  }

  async getAdminDashboardStats() {
    return this.request(endpoints.endpoints.admin.getDashboardStats.url, {
      method: endpoints.endpoints.admin.getDashboardStats.method,
    });
  }

  async getAdminTasks(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.admin.getTasks.url + queryString, {
      method: endpoints.endpoints.admin.getTasks.method,
    });
  }

  async getAdminTaskDetails(taskId) {
    return this.request(endpoints.endpoints.admin.getTaskDetails.url, {
      method: endpoints.endpoints.admin.getTaskDetails.method,
    }, {
      task_id: taskId
    });
  }

  async createTask(taskData) {
    return this.request(endpoints.endpoints.admin.createTask.url, {
      method: endpoints.endpoints.admin.createTask.method,
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId, taskData) {
    return this.request(endpoints.endpoints.admin.updateTask.url, {
      method: endpoints.endpoints.admin.updateTask.method,
      body: JSON.stringify(taskData),
    }, {
      task_id: taskId
    });
  }

  async deleteTask(taskId) {
    return this.request(endpoints.endpoints.admin.deleteTask.url, {
      method: endpoints.endpoints.admin.deleteTask.method,
    }, {
      task_id: taskId
    });
  }

  // Notification methods
  async adminSendNotification(notificationData) {
    return this.request(endpoints.endpoints.notifications.adminSend.url, {
      method: endpoints.endpoints.notifications.adminSend.method,
      body: JSON.stringify(notificationData),
    });
  }

  async adminBroadcastNotification(notificationData) {
    return this.request(endpoints.endpoints.notifications.adminBroadcast.url, {
      method: endpoints.endpoints.notifications.adminBroadcast.method,
      body: JSON.stringify(notificationData),
    });
  }

  async adminDeleteNotification(notificationId) {
    return this.request(endpoints.endpoints.notifications.adminDelete.url, {
      method: endpoints.endpoints.notifications.adminDelete.method,
    }, {
      notification_id: notificationId
    });
  }

  async adminGetAllNotifications(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.notifications.adminGetAll.url + queryString, {
      method: endpoints.endpoints.notifications.adminGetAll.method,
    });
  }

  // Partner methods
  async getPartnerDashboard() {
    return this.request(endpoints.endpoints.partners.getDashboard.url, {
      method: endpoints.endpoints.partners.getDashboard.method,
    });
  }

  async adminPromoteToPartner(userData) {
    return this.request(endpoints.endpoints.partners.adminPromote.url, {
      method: endpoints.endpoints.partners.adminPromote.method,
      body: JSON.stringify(userData),
    });
  }

  async adminDemoteFromPartner(userData) {
    return this.request(endpoints.endpoints.partners.adminDemote.url, {
      method: endpoints.partners.adminDemote.method,
      body: JSON.stringify(userData),
    });
  }

  async adminApprovePartner(userData) {
    return this.request(endpoints.endpoints.partners.adminApprove.url, {
      method: endpoints.endpoints.partners.adminApprove.method,
      body: JSON.stringify(userData),
    });
  }

  async adminDenyPartner(userData) {
    return this.request(endpoints.endpoints.partners.adminDeny.url, {
      method: endpoints.partners.adminDeny.method,
      body: JSON.stringify(userData),
    });
  }

  async adminListPartners(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.partners.adminList.url + queryString, {
      method: endpoints.endpoints.partners.adminList.method,
    });
  }

  async partnerGenerateCodes(codesData) {
    return this.request(endpoints.endpoints.partners.generateCodes.url, {
      method: endpoints.endpoints.partners.generateCodes.method,
      body: JSON.stringify(codesData),
    });
  }

  // Task methods
  async adminCreateTask(taskData) {
    return this.request(endpoints.endpoints.tasks.adminCreate.url, {
      method: endpoints.endpoints.tasks.adminCreate.method,
      body: JSON.stringify(taskData),
    });
  }

  async adminUpdateTask(taskId, taskData) {
    return this.request(endpoints.endpoints.tasks.adminUpdate.url, {
      method: endpoints.endpoints.tasks.adminUpdate.method,
      body: JSON.stringify(taskData),
    }, {
      task_id: taskId
    });
  }

  async adminDeleteTask(taskId) {
    return this.request(endpoints.endpoints.tasks.adminDelete.url, {
      method: endpoints.endpoints.tasks.adminDelete.method,
    }, {
      task_id: taskId
    });
  }

  async adminGetAllTasks(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.tasks.adminGetAll.url + queryString, {
      method: endpoints.endpoints.tasks.adminGetAll.method,
    });
  }

  async adminSetDailyRequirement(requirementData) {
    return this.request(endpoints.endpoints.tasks.adminSetDailyRequirement.url, {
      method: endpoints.endpoints.tasks.adminSetDailyRequirement.method,
      body: JSON.stringify(requirementData),
    });
  }

  async adminCompleteTaskForUser(taskId, userData) {
    return this.request(endpoints.endpoints.tasks.adminCompleteTask.url, {
      method: endpoints.endpoints.tasks.adminCompleteTask.method,
      body: JSON.stringify(userData),
    }, {
      task_id: taskId
    });
  }

  async adminGetCompletedTasks(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.tasks.adminGetCompletedTasks.url + queryString, {
      method: endpoints.endpoints.tasks.adminGetCompletedTasks.method,
    });
  }

  async adminGetReviewHistory(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.tasks.adminGetReviewHistory.url + queryString, {
      method: endpoints.endpoints.tasks.adminGetReviewHistory.method,
    });
  }

  async adminRejectTask(userTaskId, reasonData = {}) {
    return this.request(endpoints.endpoints.tasks.adminRejectTask.url, {
      method: endpoints.endpoints.tasks.adminRejectTask.method,
      body: JSON.stringify(reasonData),
    }, {
      user_task_id: userTaskId
    });
  }

  async getRejectedTasks(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.tasks.getRejectedTasks.url + queryString, {
      method: endpoints.endpoints.tasks.getRejectedTasks.method,
    });
  }

  // Additional methods from API documentation
  async getPointsHistory(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.points.getHistory.url + queryString, {
      method: endpoints.endpoints.points.getHistory.method,
    });
  }

  async getReferralBonuses(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.referrals.adminGetBonuses.url + queryString, {
      method: endpoints.endpoints.referrals.adminGetBonuses.method,
    });
  }

  async getTopReferrers() {
    return this.request(endpoints.endpoints.referrals.adminGetTopReferrers.url, {
      method: endpoints.endpoints.referrals.adminGetTopReferrers.method,
    });
  }

  async getCodesAdmin(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.admin.getCodes.url + queryString, {
      method: endpoints.endpoints.admin.getCodes.method,
    });
  }

  async generateCodes(codeData) {
    return this.request(endpoints.endpoints.admin.generateCodes.url, {
      method: endpoints.endpoints.admin.generateCodes.method,
      body: JSON.stringify(codeData),
    });
  }

  async getPartnerStats() {
    return this.request(endpoints.endpoints.partners.getStats.url, {
      method: endpoints.endpoints.partners.getStats.method,
    });
  }

  async getPartnerReferrals(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.partners.getReferrals.url + queryString, {
      method: endpoints.endpoints.partners.getReferrals.method,
    });
  }

  async getCommissionRates() {
    return this.request(endpoints.endpoints.partners.getCommissionRates.url, {
      method: endpoints.endpoints.partners.getCommissionRates.method,
    });
  }

  async adminPromoteToPartner(userData) {
    return this.request(endpoints.endpoints.partners.adminPromote.url, {
      method: endpoints.endpoints.partners.adminPromote.method,
      body: JSON.stringify(userData),
    });
  }

  async adminDemoteFromPartner(userData) {
    return this.request(endpoints.endpoints.partners.adminDemote.url, {
      method: endpoints.partners.adminDemote.method,
      body: JSON.stringify(userData),
    });
  }

  async adminApprovePartner(userData) {
    return this.request(endpoints.endpoints.partners.adminApprove.url, {
      method: endpoints.endpoints.partners.adminApprove.method,
      body: JSON.stringify(userData),
    });
  }

  async adminDenyPartner(userData) {
    return this.request(endpoints.endpoints.partners.adminDeny.url, {
      method: endpoints.endpoints.partners.adminDeny.method,
      body: JSON.stringify(userData),
    });
  }

  async adminListPartners(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    return this.request(endpoints.endpoints.partners.adminList.url + queryString, {
      method: endpoints.endpoints.partners.adminList.method,
    });
  }

  async partnerGenerateCodes(codeData) {
    return this.request(endpoints.endpoints.partners.generateCodes.url, {
      method: endpoints.endpoints.partners.generateCodes.method,
      body: JSON.stringify(codeData),
    });
  }
}

// Create a singleton instance
const apiService = new ApiService();
export default apiService;