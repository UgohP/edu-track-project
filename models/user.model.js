import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minLength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minLength: 8,
    },
    role: {
      type: String,
      enum: ["Teacher", "Student"],
      required: true,
    },
  },
  { timestamps: true }
);

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password") || !this.password) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
