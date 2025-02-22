import "dotenv/config";
import "./config/passport.config";
import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import cors from "cors";
import { config } from "./config/app.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { initializeDatabase } from "./database/database";
import authRoutes from "./routes/auth.route";
import eventRoutes from "./routes/event.route";
import { passportAuthenticateJWT } from "./config/passport.config";
import integrationRoutes from "./routes/integration.route";
import availabilityRoutes from "./routes/availability.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(HTTPSTATUS.OK).json({
      message: "Hello Subscribe to the channel & share",
    });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/integration`, integrationRoutes);
app.use(`${BASE_PATH}/event`, eventRoutes);
app.use(
  `${BASE_PATH}/availability`,
  passportAuthenticateJWT,
  availabilityRoutes
);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  await initializeDatabase();
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
});
