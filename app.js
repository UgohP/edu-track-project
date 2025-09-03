import express from "express";
import { PORT } from "./config/env.js";
import connectDB from "./config/db.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

//Middleware
app.use(errorMiddleware)

app.listen(PORT, async () => {
  console.log(`Application is running on http://localhost:${PORT}`);
  await connectDB();
});

export default app;
