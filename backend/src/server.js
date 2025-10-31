import dotenv from "dotenv";
import app from "./app.js";
import {
  prisma,
  testConnection,
  disconnectDatabase,
} from "./config/database.js";

dotenv.config();

// Server configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Test database connection
async function connectDatabase() {
  try {
    await testConnection();
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${NODE_ENV}`);
      console.log(`🔗 Server URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server");
  await disconnectDatabase();
  process.exit(0);
});

// Start the server
startServer();
