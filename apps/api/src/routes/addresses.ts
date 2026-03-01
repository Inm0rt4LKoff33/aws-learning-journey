import { FastifyInstance } from "fastify"

type AddressBody = {
  label?:   string
  street:   string
  city:     string
  state:    string
  zip:      string
  country?: string
}

const addressSchema = {
  type: "object",
  properties: {
    label:   { type: "string" },
    street:  { type: "string", minLength: 1 },
    city:    { type: "string", minLength: 1 },
    state:   { type: "string", minLength: 1 },
    zip:     { type: "string", minLength: 1 },
    country: { type: "string" },
  },
}

export default async function addressRoutes(server: FastifyInstance) {

  // All address routes require auth
  server.addHook("preHandler", server.authenticate)

  // ── GET /users/me/addresses ────────────────────────────────────────────────
  server.get("/users/me/addresses", async (req, reply) => {
    const addresses = await server.prisma.address.findMany({
      where:   { userId: req.user.userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    })
    return reply.send({ addresses })
  })

  // ── POST /users/me/addresses ───────────────────────────────────────────────
  server.post<{ Body: AddressBody }>("/users/me/addresses", {
    schema: {
      body: { ...addressSchema, required: ["street", "city", "state", "zip"] },
    },
  }, async (req, reply) => {
    const { label, street, city, state, zip, country } = req.body

    // If this is the user's first address, make it default automatically
    const count = await server.prisma.address.count({
      where: { userId: req.user.userId },
    })

    const address = await server.prisma.address.create({
      data: {
        userId: req.user.userId,
        label:     label   ?? "Home",
        street, city, state, zip,
        country:   country ?? "US",
        isDefault: count === 0,
      },
    })

    return reply.code(201).send({ address })
  })

  // ── PATCH /users/me/addresses/:id ─────────────────────────────────────────
  server.patch<{
    Params: { id: string }
    Body:   Partial<AddressBody>
  }>("/users/me/addresses/:id", {
    schema: { body: addressSchema },
  }, async (req, reply) => {
    const address = await server.prisma.address.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    })
    if (!address) return reply.code(404).send({ error: "Address not found." })

    const updated = await server.prisma.address.update({
      where: { id: req.params.id },
      data:  req.body,
    })
    return reply.send({ address: updated })
  })

  // ── DELETE /users/me/addresses/:id ────────────────────────────────────────
  server.delete<{ Params: { id: string } }>(
    "/users/me/addresses/:id",
    async (req, reply) => {
      const address = await server.prisma.address.findFirst({
        where: { id: req.params.id, userId: req.user.userId },
      })
      if (!address) return reply.code(404).send({ error: "Address not found." })

      await server.prisma.address.delete({ where: { id: req.params.id } })

      // If deleted address was the default, promote the oldest remaining one
      if (address.isDefault) {
        const next = await server.prisma.address.findFirst({
          where:   { userId: req.user.userId },
          orderBy: { createdAt: "asc" },
        })
        if (next) {
          await server.prisma.address.update({
            where: { id: next.id },
            data:  { isDefault: true },
          })
        }
      }

      return reply.code(204).send()
    }
  )

  // ── PUT /users/me/addresses/:id/default ───────────────────────────────────
  server.put<{ Params: { id: string } }>(
    "/users/me/addresses/:id/default",
    async (req, reply) => {
      const address = await server.prisma.address.findFirst({
        where: { id: req.params.id, userId: req.user.userId },
      })
      if (!address) return reply.code(404).send({ error: "Address not found." })

      // Unset all other defaults first, then set this one — atomic via transaction
      await server.prisma.$transaction([
        server.prisma.address.updateMany({
          where: { userId: req.user.userId },
          data:  { isDefault: false },
        }),
        server.prisma.address.update({
          where: { id: req.params.id },
          data:  { isDefault: true },
        }),
      ])

      return reply.send({ message: "Default address updated." })
    }
  )
}