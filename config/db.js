import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI variable inside your .env file"
  );
}

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(MONGODB_URI);
    console.log(`Database Connected: ${connect.connection.host}`);
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
};

export default connectDB