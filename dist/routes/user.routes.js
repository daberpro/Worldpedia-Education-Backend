"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
/**
 * User Routes
 * Base: /api/users
 */
// Public routes - search users (basic info only)
router.get('/search', controllers_1.UserController.searchUsers);
router.get('/:username', controllers_1.UserController.getUserByUsername);
// Protected routes
router.get('/me', middleware_1.authenticate, controllers_1.UserController.getMyProfile);
router.get('/profile', middleware_1.authenticate, controllers_1.UserController.getUserProfile);
router.put('/profile', middleware_1.authenticate, controllers_1.UserController.updateUserProfile);
router.get('/:id/stats', middleware_1.authenticate, controllers_1.UserController.getUserStats);
router.get('/:id/activity', middleware_1.authenticate, controllers_1.UserController.getUserActivityLog);
router.delete('/:id', middleware_1.authenticate, controllers_1.UserController.deleteUserAccount);
// Admin only routes
router.get('/', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.UserController.getAllUsers);
router.patch('/:id/role', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.UserController.updateUserRole);
router.patch('/:id/lock', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.UserController.lockUserAccount);
router.patch('/:id/unlock', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.UserController.unlockUserAccount);
router.patch('/bulk', middleware_1.authenticate, (0, middleware_1.authorize)(['admin']), controllers_1.UserController.bulkUpdateUsers);
exports.default = router;
//# sourceMappingURL=user.routes.js.map