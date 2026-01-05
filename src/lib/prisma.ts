import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient();
    }
    return (globalForPrisma.prisma as any)[prop];
  },
});

if (process.env.NODE_ENV !== "production") {
  // We can't easily assign the proxy back to global without triggering getter potentially,
  // but the get trap handles the global cache check, so we are good.
  // The previous code verified checking globalForPrisma inside the getter.
}
