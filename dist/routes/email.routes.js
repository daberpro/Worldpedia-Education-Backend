"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const email_controller_1 = __importDefault(require("../controllers/email.controller"));
const router = (0, express_1.Router)();
/**
 * Public Routes
 */
// Send test email
router.post('/test', email_controller_1.default.sendTestEmail.bind(email_controller_1.default));
exports.default = router;
//# sourceMappingURL=email.routes.js.map