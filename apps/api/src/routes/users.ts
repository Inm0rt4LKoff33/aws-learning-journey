import { FastifyInstance } from "fastify"

export default async function userRoutes(server: FastifyInstance) {

  // ── GET /users/me ──────────────────────────────────────────────────────────
  server.get("/users/me", {
    preHandler: [server.authenticate],
  }, async (req, reply) => {
    const user = await server.prisma.user.findUnique({
      where:  { id: req.user.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    })

    if (!user) return reply.code(404).send({ error: "User not found." })
    return reply.send({ user })
  })

  // ── PATCH /users/me ────────────────────────────────────────────────────────
  server.patch<{
    Body: { name?: string; email?: string }
  }>("/users/me", {
    preHandler: [server.authenticate],
    schema: {
      body: {
        type: "object",
        properties: {
          name:  { type: "string", minLength: 2 },
          email: { type: "string", format: "email" },
        },
      },
    },
  }, async (req, reply) => {
    const { name, email } = req.body

    // If changing email, check it isn't already taken
    if (email) {
      const taken = await server.prisma.user.findFirst({
        where: { email, NOT: { id: req.user.userId } },
      })
      if (taken) {
        return reply.code(409).send({ error: "Email already in use." })
      }
    }

    const updated = await server.prisma.user.update({
      where:  { id: req.user.userId },
      data:   { ...(name && { name }), ...(email && { email }) },
      select: { id: true, name: true, email: true },
    })

    return reply.send({ user: updated })
  })
}