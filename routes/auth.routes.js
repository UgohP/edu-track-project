import { Router } from "express";
import { login, signup } from "../controllers/auth.controllers.js";
const authRouter = Router();

authRouter.post("/single/signup", signup);

authRouter.post("/bulk/signup", signup);

authRouter.post("/login", login);

authRouter.post("/logout", (req, res) => {
  res.send({ title: "LOGOUT a user" });
});

export default authRouter;
