import "dotenv/config"
import Fastify from "fastify"
import cors from "@fastify/cors"

import prismaPlugin from "./plugins/prisma"
import redisPlugin  from "./plugins/redis"
import jwtPlugin    from "./plugins/jwt"


import addressRoutes    from "./routes/addresses"
import authRoutes       from "./routes/auth"
import cartRoutes       from "./routes/cart"
import orderRoutes      from "./routes/orders"
import productRoutes    from "./routes/products"
import userRoutes       from "./routes/users"

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "warn" : "info",
    ...(process.env.NODE_ENV !== "production" && {
      transport: {
        target:  "pino-pretty",
        options: { colorize: true },
      },
    }),
  },
})

async function bootstrap() {
  // ── CORS ───────────────────────────────────────────────────────────────────
  await server.register(cors, {
    origin:      process.env.CORS_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  })

  // ── Plugins (order matters — routes depend on these) ───────────────────────
  await server.register(prismaPlugin)
  await server.register(redisPlugin)
  await server.register(jwtPlugin)

  // ── Routes ─────────────────────────────────────────────────────────────────
  await server.register(authRoutes)
  await server.register(userRoutes)
  await server.register(addressRoutes)
  await server.register(productRoutes)
  await server.register(cartRoutes)
  await server.register(orderRoutes)

  // ── Health check ───────────────────────────────────────────────────────────
  server.get("/health", async () => ({ status: "ok", timestamp: new Date().toISOString() }))

  // ── Start ──────────────────────────────────────────────────────────────────
  const port = parseInt(process.env.PORT ?? "3001")
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1"

  await server.listen({ port, host })
  server.log.info(`API running at http://${host}:${port}`)
}

bootstrap().catch((err) => {
  server.log.error(err)
  process.exit(1)
})