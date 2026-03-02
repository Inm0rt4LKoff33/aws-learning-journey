import fp from "fastify-plugin"
import { FastifyPluginAsync } from "fastify"
import { PrismaClient } from "@prisma/client"

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server) => {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  })

  await prisma.$connect()

  // Make prisma accessible as server.prisma throughout the app
  server.decorate("prisma", prisma)

  server.addHook("onClose", async (instance) => {
    await instance.prisma.$disconnect()
  })
})

export default prismaPlugin