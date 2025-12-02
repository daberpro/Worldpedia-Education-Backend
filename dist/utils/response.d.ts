import { ApiResponse, PaginatedResponse } from '../types';
/**
 * Format success response
 */
export declare const successResponse: <T>(data: T, message?: string) => ApiResponse<T>;
/**
 * Format paginated success response
 */
export declare const paginatedResponse: <T>(items: T[], total: number, page: number, limit: number) => ApiResponse<PaginatedResponse<T>>;
/**
 * Format error response
 */
export declare const errorResponse: (error: string) => ApiResponse;
/**
 * Format validation error response
 */
export declare const validationErrorResponse: (errors: Record<string, string>) => ApiResponse;
/**
 * Format created response
 */
export declare const createdResponse: <T>(data: T, message?: string) => ApiResponse<T>;
/**
 * Format updated response
 */
export declare const updatedResponse: <T>(data: T, message?: string) => ApiResponse<T>;
/**
 * Format deleted response
 */
export declare const deletedResponse: (message?: string) => ApiResponse;
declare const _default: {
    successResponse: <T>(data: T, message?: string) => ApiResponse<T>;
    paginatedResponse: <T_1>(items: T_1[], total: number, page: number, limit: number) => ApiResponse<PaginatedResponse<T_1>>;
    errorResponse: (error: string) => ApiResponse<any>;
    validationErrorResponse: (errors: Record<string, string>) => ApiResponse<any>;
    createdResponse: <T_2>(data: T_2, message?: string) => ApiResponse<T_2>;
    updatedResponse: <T_3>(data: T_3, message?: string) => ApiResponse<T_3>;
    deletedResponse: (message?: string) => ApiResponse<any>;
};
export default _default;
//# sourceMappingURL=response.d.ts.map