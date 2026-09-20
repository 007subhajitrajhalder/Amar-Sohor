import "dotenv/config";

import app from "./app.js";

import {
  testDatabaseConnection,
} from "./config/database.js";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    const isDatabaseConnected =
      await testDatabaseConnection();

    if (!isDatabaseConnected) {
      console.error(
        "The server cannot start without MySQL."
      );

      process.exit(1);
    }

    const server = app.listen(PORT, () => {
      console.log(
        "========================================"
      );

      console.log(
        "Amar Sohor backend started successfully"
      );

      console.log(
        `Server: http://localhost:${PORT}`
      );

      console.log(
        `Health: http://localhost:${PORT}/api/health`
      );

      console.log(
        `Database: http://localhost:${PORT}` +
        `/api/health/database`
      );

      console.log(
        "========================================"
      );
    });

    process.on("SIGINT", () => {
      console.log(
        "\nClosing Amar Sohor server..."
      );

      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });

    process.on("SIGTERM", () => {
      server.close(() => {
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(
      "Unable to start the backend:",
      error
    );

    process.exit(1);
  }
}

startServer();

process.on(
  "unhandledRejection",
  (error) => {
    console.error(
      "Unhandled promise rejection:",
      error
    );
  }
);

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "Uncaught exception:",
      error
    );

    process.exit(1);
  }
);