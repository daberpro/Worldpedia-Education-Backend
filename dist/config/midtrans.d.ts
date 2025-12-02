import { Snap, CoreApi } from 'midtrans-client';
/**
 * Midtrans Configuration
 */
export declare const midtransConfig: {
    serverKey: string;
    clientKey: string;
    isProduction: boolean;
};
/**
 * Initialize Snap API for payment link
 */
export declare const snapClient: Snap;
/**
 * Initialize Core API for transactions
 */
export declare const coreApi: CoreApi;
/**
 * Verify Midtrans Connection
 */
export declare const verifyMidtransConnection: () => Promise<void>;
/**
 * Get available payment methods
 */
export declare const getAvailablePaymentMethods: () => {
    creditCard: {
        name: string;
        enabled: boolean;
        currencies: string[];
    };
    bankTransfer: {
        name: string;
        enabled: boolean;
        currencies: string[];
    };
    eWallet: {
        name: string;
        enabled: boolean;
        currencies: string[];
    };
    bnpl: {
        name: string;
        enabled: boolean;
        currencies: string[];
    };
    echannel: {
        name: string;
        enabled: boolean;
        currencies: string[];
    };
};
declare const _default: {
    snapClient: Snap;
    coreApi: CoreApi;
    midtransConfig: {
        serverKey: string;
        clientKey: string;
        isProduction: boolean;
    };
    verifyMidtransConnection: () => Promise<void>;
    getAvailablePaymentMethods: () => {
        creditCard: {
            name: string;
            enabled: boolean;
            currencies: string[];
        };
        bankTransfer: {
            name: string;
            enabled: boolean;
            currencies: string[];
        };
        eWallet: {
            name: string;
            enabled: boolean;
            currencies: string[];
        };
        bnpl: {
            name: string;
            enabled: boolean;
            currencies: string[];
        };
        echannel: {
            name: string;
            enabled: boolean;
            currencies: string[];
        };
    };
};
export default _default;
//# sourceMappingURL=midtrans.d.ts.map