import axios from 'axios';
import config from '../config/config.js';

/**
 * Paystack Service
 * Handles all Paystack API interactions for payment processing
 */
class PaystackService {
  constructor() {
    this.baseURL = 'https://api.paystack.co';
    this.secretKey = config.PAYSTACK_SECRET_KEY;
  }

  /**
   * Initialize a Paystack transaction
   * @param {Object} transactionData - Transaction initialization data
   * @param {string} transactionData.email - Customer email
   * @param {number} transactionData.amount - Amount in kobo (smallest currency unit)
   * @param {string} transactionData.reference - Unique transaction reference
   * @param {Object} transactionData.metadata - Additional metadata
   * @param {string} transactionData.callback_url - Callback URL after payment
   * @returns {Promise<Object>} Paystack API response
   */
  async initializeTransaction(transactionData) {
    try {
      const payload = {
        email: transactionData.email,
        amount: transactionData.amount, // Amount in kobo/cents
        reference: transactionData.reference,
        currency: transactionData.currency || 'KES',
        metadata: transactionData.metadata || {},
        callback_url: transactionData.callback_url,
        channels: transactionData.channels || ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
      };

      const response = await axios.post(
        `${this.baseURL}/transaction/initialize`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data.data,
        message: 'Transaction initialized successfully'
      };
    } catch (error) {
      console.error('Paystack Initialize Transaction Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to initialize transaction');
    }
  }

  /**
   * Verify a Paystack transaction
   * @param {string} reference - Transaction reference to verify
   * @returns {Promise<Object>} Verification result
   */
  async verifyTransaction(reference) {
    try {
      if (!reference) {
        throw new Error('Transaction reference is required');
      }

      const response = await axios.get(
        `${this.baseURL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`
          }
        }
      );

      const { status, data } = response.data;

      if (status && data.status === 'success') {
        return {
          success: true,
          verified: true,
          data: {
            reference: data.reference,
            amount: data.amount / 100, // Convert from kobo/cents to main currency
            currency: data.currency,
            status: data.status,
            paid_at: data.paid_at,
            created_at: data.created_at,
            channel: data.channel,
            customer: data.customer,
            authorization: data.authorization
          },
          message: 'Payment verified successfully'
        };
      } else {
        return {
          success: false,
          verified: false,
          data: response.data,
          message: 'Payment verification failed'
        };
      }
    } catch (error) {
      console.error('Paystack Verify Transaction Error:', error.response?.data || error.message);

      if (error.response) {
        // Paystack API error
        throw new Error(error.response.data.message || 'Payment verification failed');
      } else {
        // Network or other error
        throw new Error('Network error during payment verification');
      }
    }
  }

  /**
   * Get transaction details by reference
   * @param {string} reference - Transaction reference
   * @returns {Promise<Object>} Transaction details
   */
  async getTransaction(reference) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`
          }
        }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Paystack Get Transaction Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to retrieve transaction');
    }
  }

  /**
   * List transactions with optional filters
   * @param {Object} filters - Filter options
   * @param {string} filters.reference - Filter by reference
   * @param {string} filters.customer - Filter by customer email
   * @param {string} filters.status - Filter by status
   * @param {number} filters.page - Page number
   * @param {number} filters.perPage - Items per page
   * @returns {Promise<Object>} List of transactions
   */
  async listTransactions(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.reference) params.append('reference', filters.reference);
      if (filters.customer) params.append('customer', filters.customer);
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.perPage) params.append('perPage', filters.perPage.toString());

      const response = await axios.get(
        `${this.baseURL}/transaction?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`
          }
        }
      );

      return {
        success: true,
        data: response.data.data,
        meta: response.data.meta
      };
    } catch (error) {
      console.error('Paystack List Transactions Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to retrieve transactions');
    }
  }

  /**
   * Charge authorization (for recurring payments)
   * @param {Object} chargeData - Charge data
   * @param {string} chargeData.authorization_code - Authorization code
   * @param {string} chargeData.email - Customer email
   * @param {number} chargeData.amount - Amount in kobo
   * @param {string} chargeData.reference - Unique reference
   * @returns {Promise<Object>} Charge result
   */
  async chargeAuthorization(chargeData) {
    try {
      const payload = {
        authorization_code: chargeData.authorization_code,
        email: chargeData.email,
        amount: chargeData.amount,
        reference: chargeData.reference,
        currency: chargeData.currency || 'KES'
      };

      const response = await axios.post(
        `${this.baseURL}/transaction/charge_authorization`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data.data,
        message: 'Authorization charged successfully'
      };
    } catch (error) {
      console.error('Paystack Charge Authorization Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to charge authorization');
    }
  }

  /**
   * Generate a unique transaction reference
   * @param {string} prefix - Optional prefix for the reference
   * @returns {string} Unique reference
   */
  generateReference(prefix = 'BRAN') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Convert amount to kobo/cents (smallest currency unit)
   * @param {number} amount - Amount in main currency
   * @returns {number} Amount in kobo/cents
   */
  toSmallestUnit(amount) {
    return Math.round(amount * 100);
  }

  /**
   * Convert amount from kobo/cents to main currency
   * @param {number} amount - Amount in kobo/cents
   * @returns {number} Amount in main currency
   */
  fromSmallestUnit(amount) {
    return amount / 100;
  }
}

// Export a singleton instance
export default new PaystackService();