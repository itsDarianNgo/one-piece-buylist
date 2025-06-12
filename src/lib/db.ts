import { PrismaClient } from "@prisma/client";

// This file sets up a singleton instance of the Prisma client.
// This is a best practice to prevent creating too many connections
// to the database, especially in a serverless environment or during
// development with Next.js's hot-reloading.

const prismaClientSingleton = () => {
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

// If we're in production, we create a new client.
// If we're in development, we check if a client is already attached
// to the global object. If not, we create one. This prevents exhausting
// the database connection limit during development.
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;