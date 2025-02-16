import "dotenv/config";
import { DataSource } from "typeorm";
import { parse } from "pg-connection-string"; // To parse the Postgres URL
import { config } from "./app.config";

// Parse the Neon Postgres URL
const parseNeonUrl = (url: string) => {
  const { host, port, user, password, database } = parse(url);
  return {
    host: host || "localhost",
    port: parseInt(port || "5432", 10),
    username: user || "postgres",
    password: password || "postgres",
    database: database || "meetly_db",
  };
};

// Get database configuration
export const getDatabaseConfig = () => {
  const isProduction = config.NODE_ENV === "production";
  const neonUrl = config.NEON_POSTGRES_URL;

  const connection = parseNeonUrl(neonUrl);

  return new DataSource({
    type: "postgres",
    url: config.NEON_POSTGRES_URL,
    entities: [__dirname + "/../database/entities/*{.ts,.js}"], // Updated path
    migrations: [__dirname + "/../database/migrations/*{.ts,.js}"], // Updated path
    synchronize: !isProduction,
    logging: ["error"],
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  });
};

// Export the DataSource instance
export const AppDataSource = getDatabaseConfig();

//if nont using neonUrl
//import 'reflect-metadata';
// export const AppDataSource = new DataSource({
//   type: "postgres", // Database type
//   host: process.env.DB_HOST || "localhost", // Database host
//   port: parseInt(process.env.DB_PORT || "5432", 10), // Database port
//   username: process.env.DB_USERNAME || "postgres", // Database username
//   password: process.env.DB_PASSWORD || "postgres", // Database password
//   database: process.env.DB_NAME || "myapp", // Database name
//   synchronize: process.env.NODE_ENV !== "production", // Auto-sync schema in development
//   logging: process.env.NODE_ENV !== "production", // Enable logging in development
//   entities: [User, Event, Booking, Availability, DayAvailability], // Add all entities here
//   migrations: [], // Add migrations here
//   subscribers: [], // Add subscribers here
// });
