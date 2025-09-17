import { Router } from "express";
const enrollmentRouter = Router();

enrollmentRouter.post("/:courseId", (req, res) => {
  res.send({ title: "ENROLLS a new student" });
});

export default enrollmentRouter;
