import { Router } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import { enrollCourse } from "../controllers/enrollment.controllers.js";
const enrollmentRouter = Router();

enrollmentRouter.post("/:courseId", authorize, enrollCourse);

enrollmentRouter.get("/getMyCourses", (req, res) => {
  res.send({ title: "GETS courses of a particular student" });
});

enrollmentRouter.get("/course/:courseId/students", (req, res) => {
  res.send({ title: "Teacher gets all the students in his/her course" });
});

export default enrollmentRouter;