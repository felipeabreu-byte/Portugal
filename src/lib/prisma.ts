import { PrismaClient } from "@prisma/client";

let prismaInstance: PrismaClient;

export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    if (!prismaInstance) {
      prismaInstance = new PrismaClient();
    }
    return (prismaInstance as any)[prop];
  },
});
