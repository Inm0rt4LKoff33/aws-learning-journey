import { FastifyInstance } from "fastify"
import { idParam, addressFields } from "../lib/schemas" // NEW

type AddressBody = {
  label?:   string
  street:   string
  city:     string
  state:    string
  zip:      string
  country?: string
}

export default async function addressRoutes(server: FastifyInstance) {

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
      // NEW — uses shared addressFields which adds maxLength constraints
      body: { ...addressFields, required: ["street", "city", "state", "zip"] },
    },
  }, async (req, reply) => {
    const { label, street, city, state, zip, country } = req.body

    const count = await server.prisma.address.count({
      where: { userId: req.user.userId },
    })

    const address = await server.prisma.address.create({
      data: {
        userId:    req.user.userId,
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
    schema: {
      params: idParam,      // NEW
      body:   addressFields, // NEW — adds maxLength to existing minLength
    },
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
    "/users/me/addresses/:id", {
      schema: { params: idParam }, // NEW
    },
    async (req, reply) => {
      const address = await server.prisma.address.findFirst({
        where: { id: req.params.id, userId: req.user.userId },
      })
      if (!address) return reply.code(404).send({ error: "Address not found." })

      await server.prisma.address.delete({ where: { id: req.params.id } })

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
    "/users/me/addresses/:id/default", {
      schema: { params: idParam }, // NEW
    },
    async (req, reply) => {
      const address = await server.prisma.address.findFirst({
        where: { id: req.params.id, userId: req.user.userId },
      })
      if (!address) return reply.code(404).send({ error: "Address not found." })

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