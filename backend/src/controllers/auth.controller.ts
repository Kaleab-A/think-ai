import { Request, Response, NextFunction } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { LoginDto, RegisterDto } from "../database/dto/auth.dto";
import { asyncHandlerAndValidation } from "../middlewares/withValidation.middleware";
import { loginService, registerService, googleLoginService } from "../services/auth.service";
import { asyncHandler } from "../middlewares/asyncHandler.middeware";

//withValidation(RegisterDto, "body")();

export const registerController = asyncHandlerAndValidation(
  RegisterDto,
  "body",
  async (req: Request, res: Response, registerDTO) => {
    const { user } = await registerService(registerDTO);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      user,
    });
  }
);

export const loginController = asyncHandlerAndValidation(
  LoginDto,
  "body",
  async (req: Request, res: Response, loginDto) => {
    const { user, accessToken, expiresAt } = await loginService(loginDto);
    return res.status(HTTPSTATUS.CREATED).json({
      message: "User logged in successfully",
      user,
      accessToken,
      expiresAt,
    });
  }
);

export const googleLoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { idToken } = req.body as { idToken: string };
    if (!idToken) {
      return res.status(400).json({ message: "idToken is required" });
    }

    const { user, accessToken, expiresAt } = await googleLoginService(idToken);

    res.status(HTTPSTATUS.CREATED).json({
      message: "User logged in with Google successfully",
      user,
      accessToken,
      expiresAt,
    });
  }
);
