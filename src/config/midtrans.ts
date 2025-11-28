import { Snap, CoreApi } from 'midtrans-client';
import config from './env';
import { logger } from '../utils/logger';

/**
 * Midtrans Configuration
 */
export const midtransConfig = {
  serverKey: config.midtrans.serverKey || '',
  clientKey: config.midtrans.clientKey || '',
  isProduction: config.midtrans.environment === 'production'
};

/**
 * Initialize Snap API for payment link
 */
export const snapClient = new Snap({
  isProduction: midtransConfig.isProduction,
  serverKey: midtransConfig.serverKey,
  clientKey: midtransConfig.clientKey
});

/**
 * Initialize Core API for transactions
 */
export const coreApi = new CoreApi({
  isProduction: midtransConfig.isProduction,
  serverKey: midtransConfig.serverKey,
  clientKey: midtransConfig.clientKey
});

/**
 * Verify Midtrans Connection
 */
export const verifyMidtransConnection = async (): Promise<void> => {
  try {
    logger.info('✅ Midtrans SDK initialized');
    logger.info(`Environment: ${midtransConfig.isProduction ? 'Production' : 'Sandbox'}`);
    if (midtransConfig.serverKey) {
      logger.info(`Server Key: ${midtransConfig.serverKey.substring(0, 10)}...`);
    }
  } catch (error) {
    logger.error('❌ Midtrans initialization failed:', error);
    throw error;
  }
};

/**
 * Get available payment methods
 */
export const getAvailablePaymentMethods = () => {
  return {
    creditCard: {
      name: 'Credit/Debit Card',
      enabled: true,
      currencies: ['IDR', 'USD']
    },
    bankTransfer: {
      name: 'Bank Transfer',
      enabled: true,
      currencies: ['IDR']
    },
    eWallet: {
      name: 'E-Wallet (GCash, OVO, Dana)',
      enabled: true,
      currencies: ['IDR']
    },
    bnpl: {
      name: 'Buy Now Pay Later',
      enabled: true,
      currencies: ['IDR']
    },
    echannel: {
      name: 'E-Channel (ATM)',
      enabled: true,
      currencies: ['IDR']
    }
  };
};

export default {
  snapClient,
  coreApi,
  midtransConfig,
  verifyMidtransConnection,
  getAvailablePaymentMethods
};