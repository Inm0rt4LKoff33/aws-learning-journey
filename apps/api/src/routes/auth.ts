import { FastifyInstance } from "fastify"
import bcrypt from "bcryptjs"

export default async function authRoutes(server: FastifyInstance) {

  // ── POST /auth/register ────────────────────────────────────────────────────
  server.post<{
    Body: { name: string; email: string; password: string }
  }>("/auth/register", {
    config: {
      rateLimit: { max: 5, timeWindow: "15 minutes" },
    },
    schema: {
      body: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name:     { type: "string", minLength: 2 },
          email:    { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
    },
  }, async (req, reply) => {
    const { name, email, password } = req.body

    const existing = await server.prisma.user.findUnique({ where: { email } })
    if (existing) {
      return reply.code(409).send({ error: "An account with this email already exists." })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await server.prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    })

    const token = server.jwt.sign({ userId: user.id, email: user.email })
    return reply.code(201).send({ token, user })
  })

  // ── POST /auth/login ───────────────────────────────────────────────────────
  server.post<{
    Body: { email: string; password: string }
  }>("/auth/login", {
    config: {
      rateLimit: { max: 5, timeWindow: "15 minutes" },
    },
    schema: {
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email:    { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
    },
  }, async (req, reply) => {
    const { email, password } = req.body

    const user = await server.prisma.user.findUnique({ where: { email } })
    if (!user) {
      return reply.code(401).send({ error: "Invalid email or password." })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return reply.code(401).send({ error: "Invalid email or password." })
    }

    const token = server.jwt.sign({ userId: user.id, email: user.email })
    return reply.send({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    })
  })

  // ── POST /auth/logout ──────────────────────────────────────────────────────
  server.post("/auth/logout", {
    preHandler: [server.authenticate],
  }, async (req, reply) => {
    const token   = req.headers.authorization?.replace("Bearer ", "") ?? ""
    const decoded = server.jwt.decode<{ exp: number }>(token)

    if (decoded?.exp) {
      const ttl = decoded.exp - Math.floor(Date.now() / 1000)
      if (ttl > 0) {
        await server.redis.set(`blacklist:${token}`, "1", "EX", ttl)
      }
    }

    return reply.send({ message: "Logged out successfully." })
  })
}