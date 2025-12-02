"use strict";
/**
 * Central export point for all controllers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthController = exports.PaymentController = exports.UploadController = exports.EmailController = exports.UserController = exports.AnalyticsController = exports.HelpController = exports.FormController = exports.CertificateController = exports.EnrollmentController = exports.CourseController = exports.AuthController = void 0;
var auth_controller_1 = require("./auth.controller");
Object.defineProperty(exports, "AuthController", { enumerable: true, get: function () { return auth_controller_1.AuthController; } });
var course_controller_1 = require("./course.controller");
Object.defineProperty(exports, "CourseController", { enumerable: true, get: function () { return course_controller_1.CourseController; } });
var enrollment_controller_1 = require("./enrollment.controller");
Object.defineProperty(exports, "EnrollmentController", { enumerable: true, get: function () { return enrollment_controller_1.EnrollmentController; } });
var certificate_controller_1 = require("./certificate.controller");
Object.defineProperty(exports, "CertificateController", { enumerable: true, get: function () { return certificate_controller_1.CertificateController; } });
var form_controller_1 = require("./form.controller");
Object.defineProperty(exports, "FormController", { enumerable: true, get: function () { return form_controller_1.FormController; } });
var help_controller_1 = require("./help.controller");
Object.defineProperty(exports, "HelpController", { enumerable: true, get: function () { return help_controller_1.HelpController; } });
var analytics_controller_1 = require("./analytics.controller");
Object.defineProperty(exports, "AnalyticsController", { enumerable: true, get: function () { return analytics_controller_1.AnalyticsController; } });
var user_controller_1 = require("./user.controller");
Object.defineProperty(exports, "UserController", { enumerable: true, get: function () { return user_controller_1.UserController; } });
var email_controller_1 = require("./email.controller");
Object.defineProperty(exports, "EmailController", { enumerable: true, get: function () { return email_controller_1.EmailController; } });
var upload_controller_1 = require("./upload.controller");
Object.defineProperty(exports, "UploadController", { enumerable: true, get: function () { return upload_controller_1.UploadController; } });
var payment_controller_1 = require("./payment.controller");
Object.defineProperty(exports, "PaymentController", { enumerable: true, get: function () { return payment_controller_1.PaymentController; } });
var oauth_controller_1 = require("./oauth.controller");
Object.defineProperty(exports, "OAuthController", { enumerable: true, get: function () { return oauth_controller_1.OAuthController; } });
//# sourceMappingURL=index.js.map