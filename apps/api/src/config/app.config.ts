import { getEnv } from "../utils/get-env";

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),

  NEON_POSTGRES_URL: getEnv("NEON_POSTGRES_URL"),

  JWT_SECRET: getEnv("JWT_SECRET", "secert_jwt"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "1d"),

  // DB_HOST: getEnv("DB_HOST"),
  // DB_PORT: getEnv("DB_PORT"),
  // DB_USERNAME: getEnv("DB_USERNAME"),
  // DB_PASSWORD: getEnv("DB_PASSWORD"),
  // DB_NAME: getEnv("DB_NAME"),

  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REDIRECT_URI: getEnv("GOOGLE_REDIRECT_URI"),

  ZOOM_CLIENT_ID: getEnv("ZOOM_CLIENT_ID"),
  ZOOM_CLIENT_SECRET: getEnv("ZOOM_CLIENT_SECRET"),
  ZOOM_REDIRECT_URI: getEnv("ZOOM_REDIRECT_URI"),

  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost"),
});

export const config = appConfig();
