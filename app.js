import express from "express";
import { PORT } from "./config/env.js";
import connectDB from "./config/db.js";
import errorMiddleware from "./middleware/error.middleware.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.use("/api/v1/auth", authRouter)

//Middleware
app.use(errorMiddleware)


app.listen(PORT, async () => {
  console.log(`Application is running on http://localhost:${PORT}`);
  await connectDB();
});

export default app;
