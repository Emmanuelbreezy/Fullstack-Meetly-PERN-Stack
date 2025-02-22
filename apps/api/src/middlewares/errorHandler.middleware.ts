import { ErrorRequestHandler, Response } from "express";
import { ValidationError } from "class-validator";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/app-error";
import { ErrorCodeEnum } from "../enums/error-code.enum";

export const formatValidationError = (
  res: Response,
  errors: ValidationError[]
) => {
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation failed",
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    errors: errors.map((err) => ({
      field: err.property,
      message: err.constraints,
    })),
  });
};

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): any => {
  console.error(`Error Occured on PATH: ${req.path} `, error);

  if (error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Invalid JSON format. Please check your request body.",
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error?.message || "Unknow error occurred",
  });
};
