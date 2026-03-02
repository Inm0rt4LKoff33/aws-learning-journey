import "dotenv/config"
import Fastify from "fastify"
import cors from "@fastify/cors"

import prismaPlugin    from "./plugins/prisma"
import redisPlugin     from "./plugins/redis"
import jwtPlugin       from "./plugins/jwt"
import errorHandler    from "./plugins/errorHandler"
import rateLimitPlugin from "./plugins/rateLimit"

import addressRoutes from "./routes/addresses"
import authRoutes    from "./routes/auth"
import cartRoutes    from "./routes/cart"
import orderRoutes   from "./routes/orders"
import productRoutes from "./routes/products"
import userRoutes    from "./routes/users"

const isProd = process.env.NODE_ENV === "production"

const server = Fastify({
  genReqId: (req) =>
    (req.headers["x-request-id"] as string) ??
    Math.random().toString(36).slice(2, 10),

  logger: {
    level: isProd ? "info" : "debug",

    ...(isProd
      ? {}
      : {
          transport: {
            target:  "pino-pretty",
            options: { colorize: true, ignore: "pid,hostname" },
          },
        }),

    serializers: {
      req(req) {
        return {
          method:    req.method,
          url:       req.url,
          requestId: req.id,
          // User agent helps identify bots/scrapers in CloudWatch
          userAgent: req.headers["user-agent"],
          // Remote IP for rate limit debugging — already sanitized by keyGenerator
          remoteIp:
            (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ??
            req.socket?.remoteAddress,
        }
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        }
      },
    },
  },
})

async function bootstrap() {
  // ── CORS ───────────────────────────────────────────────────────────────────
  await server.register(cors, {
    origin:      process.env.CORS_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  })

  // ── Plugins ────────────────────────────────────────────────────────────────
  await server.register(prismaPlugin)
  await server.register(redisPlugin)
  await server.register(jwtPlugin)
  await server.register(errorHandler)
  await server.register(rateLimitPlugin)

  // ── Routes ─────────────────────────────────────────────────────────────────
  await server.register(authRoutes)
  await server.register(userRoutes)
  await server.register(addressRoutes)
  await server.register(productRoutes)
  await server.register(cartRoutes)
  await server.register(orderRoutes)

  // ── Health check ───────────────────────────────────────────────────────────
  // Excluded from rate limiting — ECS and ALB hit this every 30s
  server.get("/health", {
    config: { rateLimit: false },
  }, async () => ({
    status:    "ok",
    timestamp: new Date().toISOString(),
  }))

  // ── Start ──────────────────────────────────────────────────────────────────
  const port = parseInt(process.env.PORT ?? "3001")
  // 0.0.0.0 in production so ECS can route traffic to the container.
  // 127.0.0.1 in dev so the port isn't exposed on the network.
  const host = isProd ? "0.0.0.0" : "127.0.0.1"

  await server.listen({ port, host })
}

bootstrap().catch((err) => {
  server.log.error(err, "Failed to start server")
  process.exit(1)
})