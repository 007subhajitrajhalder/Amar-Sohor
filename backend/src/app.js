import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import databasePool from "./config/database.js";

const app = express();

app.use(helmet());

app.use(morgan("dev"));

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",

    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Welcome to the Amar Sohor API",
  });
});

app.get("/api/health", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Amar Sohor backend is running",
    environment:
      process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.get(
  "/api/health/database",
  async (request, response, next) => {
    try {
      const [result] = await databasePool.query(`
        SELECT
          DATABASE() AS databaseName,
          VERSION() AS mysqlVersion,
          NOW() AS databaseTime
      `);

      response.status(200).json({
        success: true,
        message: "MySQL database is connected",
        database: result[0],
      });
    } catch (error) {
      next(error);
    }
  }
);

app.use((request, response) => {
  response.status(404).json({
    success: false,
    message:
      `Route not found: ` +
      `${request.method} ${request.originalUrl}`,
  });
});

app.use(
  (error, request, response, next) => {
    console.error("Request error:", error);

    response
      .status(error.status || 500)
      .json({
        success: false,
        message:
          process.env.NODE_ENV === "production"
            ? "Internal server error"
            : error.message ||
              "Internal server error",
      });
  }
);

export default app;