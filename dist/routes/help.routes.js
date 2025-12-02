"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.post('/ask', controllers_1.HelpController.askHelp);
router.get('/', controllers_1.HelpController.getCategories);
router.get('/stats', controllers_1.HelpController.getHelpStats);
router.get('/search', controllers_1.HelpController.searchByKeywords);
router.get('/category/:category', controllers_1.HelpController.getByCategory);
router.get('/:id', controllers_1.HelpController.getHelpArticleById);
router.post('/:id/helpful', controllers_1.HelpController.markAsHelpful);
router.post('/:id/not-helpful', controllers_1.HelpController.markAsNotHelpful);
// Admin routes
router.post('/', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.HelpController.createHelpArticle);
router.put('/:id', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.HelpController.updateHelpArticle);
router.delete('/:id', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.HelpController.deleteHelpArticle);
exports.default = router;
//# sourceMappingURL=help.routes.js.map