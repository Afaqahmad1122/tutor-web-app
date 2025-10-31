import { PrismaClient } from "@prisma/client";

// Prisma Client instance with production optimizations
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  errorFormat: "pretty",
});

// Database connection test
async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connection established");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error;
  }
}

// Graceful shutdown handler
async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error closing database connection:", error.message);
  }
}

export { prisma, testConnection, disconnectDatabase };
