import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { LoginDTO, RegisterDTO } from "../database/dto/auth.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { loginService, registerService } from "../services/auth.service";
import { HTTPSTATUS } from "../config/http.config";
import { formatValidationError } from "../middlewares/errorHandler.middleware";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const registerDTO = plainToInstance(RegisterDTO, req.body);
    const errors = await validate(registerDTO);
    if (errors?.length > 0) {
      formatValidationError(res, errors);
    }
    const { user } = await registerService(registerDTO);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      user,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const loginDTO = plainToInstance(LoginDTO, req.body);
    const errors = await validate(loginDTO);
    if (errors?.length > 0) {
      formatValidationError(res, errors);
    }
    const data = await loginService(loginDTO);

    return res.status(HTTPSTATUS.OK).json({
      message: "User logged in successfully",
      data,
    });
  }
);
