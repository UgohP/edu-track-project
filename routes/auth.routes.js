import { Router } from "express";
import {
  bulkSignup,
  login,
  singleSignup,
} from "../controllers/auth.controllers.js";
const authRouter = Router();

authRouter.post("/signup/single", singleSignup);

authRouter.post("/signup/bulk", bulkSignup);

authRouter.post("/login", login);

authRouter.post("/logout", (req, res) => {
  res.send({ title: "LOGOUT a user" });
});

export default authRouter;
