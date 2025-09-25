import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "../controllers/course.contollers.js";
import { authorize } from "../middleware/auth.middleware.js";
const courseRouter = Router();

courseRouter.get("/", getAllCourses);

courseRouter.get("/:id", getCourseById);

courseRouter.post("/", authorize, createCourse);

courseRouter.put("/:id", authorize, updateCourse);

courseRouter.delete("/:id", authorize, deleteCourse);

export default courseRouter;
