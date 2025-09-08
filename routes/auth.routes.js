import { Router } from "express";
import { signup } from "../controllers/auth.contollers.js";
const authRouter = Router();

authRouter.post("/signup", signup);

authRouter.post("/login", (req, res) => {
  res.send({ title: "LOGIN a user" });
});

authRouter.post("/logout", (req, res) => {
  res.send({ title: "LOGOUT a user" });
});

export default authRouter;
