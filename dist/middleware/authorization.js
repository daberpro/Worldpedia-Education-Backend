"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireFields = exports.isResourceOwner = exports.isStudent = exports.isAdmin = exports.authorize = void 0;
const error_types_1 = require("../types/error.types");
/**
 * Check if user has required role
 */
const authorize = (allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw new error_types_1.UnauthorizedError('Authentication required');
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw new error_types_1.ForbiddenError(`Access denied. Required role: ${allowedRoles.join(' or ')}`);
        }
        next();
    };
};
exports.authorize = authorize;
/**
 * Check if user is admin
 */
const isAdmin = (req, _res, next) => {
    if (!req.user) {
        throw new error_types_1.UnauthorizedError('Authentication required');
    }
    if (req.user.role !== 'admin') {
        throw new error_types_1.ForbiddenError('Admin access required');
    }
    next();
};
exports.isAdmin = isAdmin;
/**
 * Check if user is student
 */
const isStudent = (req, _res, next) => {
    if (!req.user) {
        throw new error_types_1.UnauthorizedError('Authentication required');
    }
    if (req.user.role !== 'student' && req.user.role !== 'admin') {
        throw new error_types_1.ForbiddenError('Student access required');
    }
    next();
};
exports.isStudent = isStudent;
/**
 * Check if user owns the resource
 */
const isResourceOwner = (userIdParam = 'userId') => {
    return (req, _res, next) => {
        if (!req.user) {
            throw new error_types_1.UnauthorizedError('Authentication required');
        }
        const resourceUserId = req.params[userIdParam];
        if (req.user.userId !== resourceUserId && req.user.role !== 'admin') {
            throw new error_types_1.ForbiddenError('You do not have permission to access this resource');
        }
        next();
    };
};
exports.isResourceOwner = isResourceOwner;
/**
 * Verify request body includes required fields
 */
const requireFields = (fields) => {
    return (req, _res, next) => {
        const missingFields = fields.filter(field => !(field in req.body));
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        next();
    };
};
exports.requireFields = requireFields;
exports.default = {
    authorize: exports.authorize,
    isAdmin: exports.isAdmin,
    isStudent: exports.isStudent,
    isResourceOwner: exports.isResourceOwner,
    requireFields: exports.requireFields
};
//# sourceMappingURL=authorization.js.map