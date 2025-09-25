import { Router } from "express";
import { authorize, studentMiddleware, teacherMiddleware } from "../middleware/auth.middleware.js";
import { createAssignment, getAssignmentsByCourse, getSubmissions, markReviewed, submitAssignment } from "../controllers/assignment.controllers.js";
const assignmentRouter = Router();

// Teacher creates assignment
assignmentRouter.post('/:courseId', authorize, teacherMiddleware, createAssignment);

// Get all assignments for a course (Students & Teachers)
assignmentRouter.get('/:courseId', authorize, getAssignmentsByCourse);

// Student submits assignment
assignmentRouter.post('/:assignmentId/submit', authorize, studentMiddleware, submitAssignment);

// Teacher views submissions
assignmentRouter.get('/:assignmentId/submissions', authorize, teacherMiddleware, getSubmissions);

// Teacher marks submission as reviewed
assignmentRouter.patch('/submission/:submissionId/review', authorize, teacherMiddleware, markReviewed);

export default assignmentRouter;
