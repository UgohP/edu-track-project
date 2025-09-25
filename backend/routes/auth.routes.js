import { Router } from "express";
import {
  bulkSignup,
  login,
  logout,
  singleSignup,
} from "../controllers/auth.controllers.js";
const authRouter = Router();

authRouter.post("/signup/single", singleSignup);

authRouter.post("/signup/bulk", bulkSignup);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

export default authRouter;
