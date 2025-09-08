import { Router } from "express";
import {
  loginController,
  registerController,
  googleLoginController,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/google", googleLoginController);

export default authRoutes;
