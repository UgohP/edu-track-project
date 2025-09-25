import express from "express";
import { PORT } from "./config/env.js";
import connectDB from "./config/db.js";
import errorMiddleware from "./middleware/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.routes.js";
import enrollmentRouter from "./routes/enrollment.routes.js";
import assignmentRouter from "./routes/assignment.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/course/enrollment", enrollmentRouter);
app.use("/api/v1/courses/assignment", assignmentRouter);


//Middleware
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Application is running on http://localhost:${PORT}`);
  await connectDB();
});

export default app;
