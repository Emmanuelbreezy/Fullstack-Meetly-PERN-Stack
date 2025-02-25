import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { HTTPSTATUS } from "../config/http.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";

type ValidationSource = "body" | "params" | "query";

export function withValidation<T extends object>(
  DtoClass: new () => T, //The DTO class to validate against.
  source: ValidationSource = "body" //data to validate (default is "body").
) {
  // Returns a middleware function
  return function (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    // Returns the actual middleware logic
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Convert the request data (body, params, or query)
        // to an instance of the DTO class
        const dtoInstance = plainToInstance(DtoClass, req[source]);

        // Validate the DTO instance using class-validator
        const errors = await validate(dtoInstance);

        // If there are validation errors, format and return them
        if (errors.length > 0) {
          return formatValidationError(res, errors);
        }

        // Attach the validated DTO instance to the
        // request object for use in the handler
        req.dto = dtoInstance;

        // Call the next middleware or the handler function
        return handler(req, res, next);
      } catch (error) {
        // Pass any unexpected errors to the error handler
        next(error);
      }
    };
  };
}

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
