import { PrismaClient } from "@prisma/client";

// Prisma Client instance with production optimizations for Neon PostgreSQL
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  errorFormat: "pretty",
});

// Database connection test using a simple query instead of $connect()
async function testConnection() {
  try {
    // Use a simple query to test connection (Prisma connects lazily)
    await prisma.$queryRaw`SELECT 1`;
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
