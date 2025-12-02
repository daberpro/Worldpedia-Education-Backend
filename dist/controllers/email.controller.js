"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const email_service_1 = __importDefault(require("../services/email.service"));
const response_1 = require("../utils/response");
const logger_1 = require("../utils/logger");
class EmailController {
    /**
     * Send test email
     */
    async sendTestEmail(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json((0, response_1.errorResponse)("Email address is required"));
                return;
            }
            const messageId = await email_service_1.default.sendEmail({
                to: email,
                subject: "Test Email - Worldpedia Education",
                html: "<p>This is a test email from Worldpedia Education platform.</p>",
                text: "This is a test email from Worldpedia Education platform.",
            });
            res
                .status(200)
                .json((0, response_1.successResponse)({ messageId }, "Test email sent successfully"));
        }
        catch (error) {
            logger_1.logger.error("Error sending test email:", error);
            res.status(500).json((0, response_1.errorResponse)("Failed to send test email"));
        }
    }
}
exports.EmailController = EmailController;
exports.default = new EmailController();
//# sourceMappingURL=email.controller.js.map