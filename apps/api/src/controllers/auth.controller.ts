import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { LoginDTO, RegisterDTO } from "../database/dto/auth.dto";
import { loginService, registerService } from "../services/auth.service";
import { HTTPSTATUS } from "../config/http.config";
import { withValidation } from "../middlewares/withValidation.middleware";

export const registerController = asyncHandler(
  withValidation(
    RegisterDTO,
    "body"
  )(async (req: Request, res: Response) => {
    //USE THIS FIRST -> TO EXPLAIN
    // const registerDTO = plainToInstance(RegisterDTO, req.body);
    // const errors = await validate(registerDTO);
    // if (errors?.length > 0) {
    //   formatValidationError(res, errors);
    // }
    const registerDTO = req.dto as RegisterDTO;
    const { user } = await registerService(registerDTO);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      user,
    });
  })
);

export const loginController = asyncHandler(
  withValidation(
    LoginDTO,
    "body"
  )(async (req: Request, res: Response) => {
    const loginDTO = req.dto as LoginDTO;
    const data = await loginService(loginDTO);

    return res.status(HTTPSTATUS.OK).json({
      message: "User logged in successfully",
      data,
    });
  })
);
