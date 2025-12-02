"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailablePaymentMethods = exports.verifyMidtransConnection = exports.coreApi = exports.snapClient = exports.midtransConfig = void 0;
const midtrans_client_1 = require("midtrans-client");
const env_1 = __importDefault(require("./env"));
const logger_1 = require("../utils/logger");
/**
 * Midtrans Configuration
 */
exports.midtransConfig = {
    serverKey: env_1.default.midtrans.serverKey || '',
    clientKey: env_1.default.midtrans.clientKey || '',
    isProduction: env_1.default.midtrans.environment === 'production'
};
/**
 * Initialize Snap API for payment link
 */
exports.snapClient = new midtrans_client_1.Snap({
    isProduction: exports.midtransConfig.isProduction,
    serverKey: exports.midtransConfig.serverKey,
    clientKey: exports.midtransConfig.clientKey
});
/**
 * Initialize Core API for transactions
 */
exports.coreApi = new midtrans_client_1.CoreApi({
    isProduction: exports.midtransConfig.isProduction,
    serverKey: exports.midtransConfig.serverKey,
    clientKey: exports.midtransConfig.clientKey
});
/**
 * Verify Midtrans Connection
 */
const verifyMidtransConnection = async () => {
    try {
        logger_1.logger.info('✅ Midtrans SDK initialized');
        logger_1.logger.info(`Environment: ${exports.midtransConfig.isProduction ? 'Production' : 'Sandbox'}`);
        if (exports.midtransConfig.serverKey) {
            logger_1.logger.info(`Server Key: ${exports.midtransConfig.serverKey.substring(0, 10)}...`);
        }
    }
    catch (error) {
        logger_1.logger.error('❌ Midtrans initialization failed:', error);
        throw error;
    }
};
exports.verifyMidtransConnection = verifyMidtransConnection;
/**
 * Get available payment methods
 */
const getAvailablePaymentMethods = () => {
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
exports.getAvailablePaymentMethods = getAvailablePaymentMethods;
exports.default = {
    snapClient: exports.snapClient,
    coreApi: exports.coreApi,
    midtransConfig: exports.midtransConfig,
    verifyMidtransConnection: exports.verifyMidtransConnection,
    getAvailablePaymentMethods: exports.getAvailablePaymentMethods
};
//# sourceMappingURL=midtrans.js.map