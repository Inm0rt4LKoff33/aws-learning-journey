import fp from "fastify-plugin"
import { FastifyPluginAsync } from "fastify"
import Redis from "ioredis"

declare module "fastify" {
  interface FastifyInstance {
    redis: Redis
  }
}

const redisPlugin: FastifyPluginAsync = fp(async (server) => {
  const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  })

  await redis.connect()

  server.decorate("redis", redis)

  server.addHook("onClose", async (instance) => {
    await instance.redis.quit()
  })

  server.log.info("Redis connected")
})

export default redisPlugin