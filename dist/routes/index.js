"use strict";
/**
 * Central export point for all routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthRoutes = exports.uploadRoutes = exports.emailRoutes = exports.userRoutes = exports.analyticsRoutes = exports.helpRoutes = exports.formRoutes = exports.certificateRoutes = exports.paymentRoutes = exports.enrollmentRoutes = exports.courseRoutes = exports.authRoutes = void 0;
var auth_routes_1 = require("./auth.routes");
Object.defineProperty(exports, "authRoutes", { enumerable: true, get: function () { return __importDefault(auth_routes_1).default; } });
var course_routes_1 = require("./course.routes");
Object.defineProperty(exports, "courseRoutes", { enumerable: true, get: function () { return __importDefault(course_routes_1).default; } });
var enrollment_routes_1 = require("./enrollment.routes");
Object.defineProperty(exports, "enrollmentRoutes", { enumerable: true, get: function () { return __importDefault(enrollment_routes_1).default; } });
var payment_routes_1 = require("./payment.routes");
Object.defineProperty(exports, "paymentRoutes", { enumerable: true, get: function () { return __importDefault(payment_routes_1).default; } });
var certificate_routes_1 = require("./certificate.routes");
Object.defineProperty(exports, "certificateRoutes", { enumerable: true, get: function () { return __importDefault(certificate_routes_1).default; } });
var form_routes_1 = require("./form.routes");
Object.defineProperty(exports, "formRoutes", { enumerable: true, get: function () { return __importDefault(form_routes_1).default; } });
var help_routes_1 = require("./help.routes");
Object.defineProperty(exports, "helpRoutes", { enumerable: true, get: function () { return __importDefault(help_routes_1).default; } });
var analytics_routes_1 = require("./analytics.routes");
Object.defineProperty(exports, "analyticsRoutes", { enumerable: true, get: function () { return __importDefault(analytics_routes_1).default; } });
var user_routes_1 = require("./user.routes");
Object.defineProperty(exports, "userRoutes", { enumerable: true, get: function () { return __importDefault(user_routes_1).default; } });
var email_routes_1 = require("./email.routes");
Object.defineProperty(exports, "emailRoutes", { enumerable: true, get: function () { return __importDefault(email_routes_1).default; } });
var upload_routes_1 = require("./upload.routes");
Object.defineProperty(exports, "uploadRoutes", { enumerable: true, get: function () { return __importDefault(upload_routes_1).default; } });
var oauth_routes_1 = require("./oauth.routes");
Object.defineProperty(exports, "oauthRoutes", { enumerable: true, get: function () { return __importDefault(oauth_routes_1).default; } });
//# sourceMappingURL=index.js.map