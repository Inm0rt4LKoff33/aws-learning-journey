import fp from "fastify-plugin"
import rateLimit from "@fastify/rate-limit"
import { FastifyInstance } from "fastify"

export default fp(async (server: FastifyInstance) => {
  await server.register(rateLimit, {
    global:     true,
    max:        300,
    timeWindow: "1 minute",

    redis: server.redis,

    keyGenerator: (req) =>
      req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ??
      req.ip,

    errorResponseBuilder: (_req, context) => ({
      statusCode: 429,
      error: `Too many requests. Please wait ${Math.ceil(context.ttl / 1000)} seconds before trying again.`,
    }),
  })
})