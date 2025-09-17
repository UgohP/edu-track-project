import { Router } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import {
  enrollCourse,
  getAllStudentsInCourse,
  getMyCourses,
} from "../controllers/enrollment.controllers.js";
const enrollmentRouter = Router();

enrollmentRouter.post("/:courseId", authorize, enrollCourse);

enrollmentRouter.get("/getMyCourses", authorize, getMyCourses);

enrollmentRouter.get(
  "/:courseId/students",
  authorize,
  getAllStudentsInCourse
);

export default enrollmentRouter;
