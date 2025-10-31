import app from "./app.js";
import connectDB from "./config/db.js";
import { PORT } from "./config/env.js";

// This file handles the side effects (DB connection, server listening)
const startServer = async () => {
    // Only connect and listen when running the actual server
    await connectDB();
    const port = PORT || 5500;
    app.listen(port, "0.0.0.0", () => {
        console.log(`Application is running on http://localhost:${port}`);
    });
};

startServer();