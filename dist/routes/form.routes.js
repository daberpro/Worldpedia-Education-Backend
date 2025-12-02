"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
/**
 * Form Routes
 * Base: /api/forms
 */
// Public routes
router.get('/course/:courseId', controllers_1.FormController.getFormsByCourse);
// Protected routes
router.post('/', middleware_1.authenticate, controllers_1.FormController.createForm);
router.get('/:id', middleware_1.authenticate, controllers_1.FormController.getFormById);
router.get('/:id/submissions', middleware_1.authenticate, controllers_1.FormController.getFormSubmissions);
router.get('/:id/my-submission', middleware_1.authenticate, controllers_1.FormController.getStudentSubmission);
router.get('/:id/analytics', middleware_1.authenticate, controllers_1.FormController.getFormAnalytics);
router.post('/:id/submit', middleware_1.authenticate, controllers_1.FormController.submitForm);
router.put('/:id', middleware_1.authenticate, controllers_1.FormController.updateForm);
router.delete('/:id', middleware_1.authenticate, controllers_1.FormController.deleteForm);
exports.default = router;
//# sourceMappingURL=form.routes.js.map