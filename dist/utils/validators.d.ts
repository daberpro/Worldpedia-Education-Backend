/**
 * Email validation
 */
export declare const isValidEmail: (email: string) => boolean;
/**
 * URL validation
 */
export declare const isValidUrl: (url: string) => boolean;
/**
 * Mongo ObjectId validation
 */
export declare const isValidObjectId: (id: string) => boolean;
/**
 * Phone number validation (Indonesia)
 */
export declare const isValidPhoneNumber: (phone: string) => boolean;
/**
 * Validate pagination parameters
 */
export declare const validatePagination: (page?: number, limit?: number) => {
    page: number;
    limit: number;
};
/**
 * Validate enum value
 */
export declare const isValidEnum: (value: string, enumValues: string[]) => boolean;
/**
 * Validate course level
 */
export declare const isValidCourseLevel: (level: string) => boolean;
/**
 * Validate enrollment status
 */
export declare const isValidEnrollmentStatus: (status: string) => boolean;
/**
 * Validate payment status
 */
export declare const isValidPaymentStatus: (status: string) => boolean;
/**
 * Validate user role
 */
export declare const isValidUserRole: (role: string) => boolean;
/**
 * Validate help category
 */
export declare const isValidHelpCategory: (category: string) => boolean;
/**
 * Validate progress (0-100)
 */
export declare const isValidProgress: (progress: number) => boolean;
/**
 * Validate price (non-negative)
 */
export declare const isValidPrice: (price: number) => boolean;
/**
 * Validate capacity
 */
export declare const isValidCapacity: (capacity: number) => boolean;
/**
 * Validate duration
 */
export declare const isValidDuration: (duration: number) => boolean;
/**
 * Sanitize string input
 */
export declare const sanitizeString: (input: string) => string;
/**
 * Escape HTML characters
 */
export declare const escapeHtml: (unsafe: string) => string;
declare const _default: {
    isValidEmail: (email: string) => boolean;
    isValidUrl: (url: string) => boolean;
    isValidObjectId: (id: string) => boolean;
    isValidPhoneNumber: (phone: string) => boolean;
    validatePagination: (page?: number | undefined, limit?: number | undefined) => {
        page: number;
        limit: number;
    };
    isValidEnum: (value: string, enumValues: string[]) => boolean;
    isValidCourseLevel: (level: string) => boolean;
    isValidEnrollmentStatus: (status: string) => boolean;
    isValidPaymentStatus: (status: string) => boolean;
    isValidUserRole: (role: string) => boolean;
    isValidHelpCategory: (category: string) => boolean;
    isValidProgress: (progress: number) => boolean;
    isValidPrice: (price: number) => boolean;
    isValidCapacity: (capacity: number) => boolean;
    isValidDuration: (duration: number) => boolean;
    sanitizeString: (input: string) => string;
    escapeHtml: (unsafe: string) => string;
};
export default _default;
//# sourceMappingURL=validators.d.ts.map