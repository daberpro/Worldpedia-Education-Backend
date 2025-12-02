/**
 * Application Constants
 */
export declare const CONSTANTS: {
    HTTP_STATUS: {
        OK: number;
        CREATED: number;
        BAD_REQUEST: number;
        UNAUTHORIZED: number;
        FORBIDDEN: number;
        NOT_FOUND: number;
        CONFLICT: number;
        UNPROCESSABLE: number;
        TOO_MANY_REQUESTS: number;
        INTERNAL_SERVER_ERROR: number;
    };
    ROLES: {
        STUDENT: string;
        ADMIN: string;
    };
    ENROLLMENT_STATUS: {
        PENDING_PAYMENT: string;
        ACTIVE: string;
        COMPLETED: string;
        CANCELLED: string;
    };
    CERTIFICATE_STATUS: {
        AVAILABLE: string;
        ASSIGNED: string;
        ACCESSED: string;
    };
    PAYMENT_STATUS: {
        PENDING: string;
        COMPLETED: string;
        FAILED: string;
        CANCELLED: string;
    };
    PAYMENT_METHODS: {
        CREDIT_CARD: string;
        DEBIT_CARD: string;
        BANK_TRANSFER: string;
        E_WALLET: string;
    };
    COURSE_LEVELS: {
        PAUD: string;
        TK: string;
        SD: string;
        SMP: string;
        SMA: string;
        UMUM: string;
    };
    HELP_CATEGORIES: {
        ACCOUNT: string;
        COURSE: string;
        ENROLLMENT: string;
        PAYMENT: string;
        CERTIFICATE: string;
        TECHNICAL: string;
        OTHER: string;
    };
    FORM_FIELD_TYPES: {
        TEXT: string;
        EMAIL: string;
        NUMBER: string;
        DATE: string;
        CHECKBOX: string;
        RADIO: string;
        SELECT: string;
        TEXTAREA: string;
    };
    ANALYTICS_TYPES: {
        ENROLLMENT: string;
        REVENUE: string;
        COMPLETION: string;
        USER: string;
    };
    RATE_LIMITS: {
        LOGIN: {
            attempts: number;
            windowMs: number;
        };
        REGISTER: {
            attempts: number;
            windowMs: number;
        };
        VERIFY_CODE: {
            attempts: number;
            windowMs: number;
        };
        RESEND_CODE: {
            attempts: number;
            windowMs: number;
        };
        FORGOT_PASSWORD: {
            attempts: number;
            windowMs: number;
        };
        GENERAL: {
            attempts: number;
            windowMs: number;
        };
    };
    PASSWORD_POLICY: {
        MIN_LENGTH: number;
        REQUIRE_UPPERCASE: boolean;
        REQUIRE_LOWERCASE: boolean;
        REQUIRE_NUMBER: boolean;
        REQUIRE_SPECIAL: boolean;
    };
    TOKEN_EXPIRY: {
        ACCESS: string;
        REFRESH: string;
        ACTIVATION: string;
        RESET_PASSWORD: string;
    };
    ACCOUNT_LOCKOUT: {
        MAX_ATTEMPTS: number;
        DURATION: number;
    };
    PAGINATION: {
        DEFAULT_LIMIT: number;
        MAX_LIMIT: number;
        DEFAULT_PAGE: number;
    };
    FILE_UPLOAD: {
        MAX_SIZE: number;
        ALLOWED_FORMATS: string[];
    };
    COURSE: {
        MIN_CAPACITY: number;
        MAX_CAPACITY: number;
        MIN_MODULES: number;
        MAX_MODULES: number;
    };
    FORM: {
        MIN_FIELDS: number;
        MAX_FIELDS: number;
        MAX_KEYWORDS: number;
    };
};
export default CONSTANTS;
//# sourceMappingURL=constants.d.ts.map