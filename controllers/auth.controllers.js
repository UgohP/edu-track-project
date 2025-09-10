import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

/**
 * Api endpoint to signup a single user
 */
// export const signup = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { name, email, password, role } = req.body;

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       let error = new Error("User already exists");
//       error.statusCode = 409;
//       throw error;
//     }

//     const newUser = await User.create([{ name, email, password, role }], {
//       session,
//     });

//     const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
//       expiresIn: JWT_EXPIRES_IN,
//     });

//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       data: { token, newUser },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     next(error);
//   }
// };

/**
 * Api endpoint to signup users in bulk
 */
export const signup = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = req.body;

    // normalize input → always work with an array
    const users = Array.isArray(body) ? body : [body];

    // check duplicates in DB for each email
    const emails = users.map((u) => u.email);
    const existingUsers = await User.find({ email: { $in: emails } });

    if (existingUsers.length > 0) {
      const error = new Error("One or more users already exist");
      error.statusCode = 409;
      throw error;
    }

    // hash all passwords
    const hashedUsers = await Promise.all(
      users.map(async (u) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        return { ...u, password: hashedPassword };
      })
    );

    // create users
    const newUsers = await User.create(hashedUsers, { session, ordered: true });

    // commit transaction
    await session.commitTransaction();
    session.endSession();

    // issue tokens (for single user only)
    let responseData;
    if (!Array.isArray(body)) {
      const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      responseData = {
        token,
        user: newUsers[0],
      };
    } else {
      responseData = { users: newUsers };
    }

    res.status(201).json({
      success: true,
      message: Array.isArray(body)
        ? `${newUsers.length} users created successfully`
        : "User created successfully",
      data: responseData,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

/**
 * Api endpoint to login a user in bulk
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      let error = new Error("Invalid credentails");
      error.statusCode = 404;
      throw error;
    }

    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      let error = new Error("Incorrect password");
      error.statusCode = 404;
      throw error;
    }

    let token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
