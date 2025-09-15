import { Router } from "express";
import { createCourse } from "../controllers/course.contollers.js";
import { authorize } from "../middleware/auth.middleware.js";
const courseRouter = Router();

courseRouter.get("/", (req, res) => {
  res.send({ title: "GET all courses" });
});

courseRouter.get("/:id", (req, res) => {
  res.send({ title: "GETs a particular course" });
});

courseRouter.post("/", authorize, createCourse);

courseRouter.put("/:id", (req, res) => {
  res.send({ title: "UPDATES a particular course" });
});

courseRouter.delete("/:id", (req, res) => {
  res.send({ title: "DELETES a particular course" });
});

// /api/v1/courses

export default courseRouter;
