import { FastifyInstance } from "fastify"
import { Decimal } from "@prisma/client/runtime/library"
import { idParam } from "../lib/schemas"

export default async function orderRoutes(server: FastifyInstance) {

  server.addHook("preHandler", server.authenticate)

  const cartKey = (userId: string) => `cart:${userId}`

  // ── POST /orders ───────────────────────────────────────────────────────────
  server.post<{
    Body: { addressId: string }
  }>("/orders", {
    config: {
      rateLimit: { max: 10, timeWindow: "1 minute" },
    },
    schema: {
      body: {
        type: "object",
        required: ["addressId"],
        properties: {
          addressId: { type: "string", minLength: 1 },
        },
      },
    },
  }, async (req, reply) => {
    const { userId }    = req.user
    const { addressId } = req.body

    const address = await server.prisma.address.findFirst({
      where: { id: addressId, userId },
    })
    if (!address) return reply.code(404).send({ error: "Address not found." })

    const raw = await server.redis.hgetall(cartKey(userId))
    if (!raw || Object.keys(raw).length === 0) {
      return reply.code(400).send({ error: "Your cart is empty." })
    }

    const cartItems = Object.entries(raw).map(([productId, qty]) => ({
      productId,
      quantity: parseInt(qty, 10),
    }))

    const products = await server.prisma.product.findMany({
      where: { id: { in: cartItems.map((i) => i.productId) } },
    })

    for (const cartItem of cartItems) {
      const product = products.find((p) => p.id === cartItem.productId)
      if (!product) {
        return reply.code(404).send({ error: `Product ${cartItem.productId} no longer exists.` })
      }
      if (product.stock < cartItem.quantity) {
        return reply.code(409).send({
          error: `"${product.name}" only has ${product.stock} units left in stock.`,
        })
      }
    }

    const subtotal = cartItems.reduce((sum, cartItem) => {
      const product = products.find((p) => p.id === cartItem.productId)!
      return sum + Number(product.price) * cartItem.quantity
    }, 0)

    const order = await server.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          addressId,
          subtotal: new Decimal(subtotal),
          items: {
            create: cartItems.map((cartItem) => {
              const product = products.find((p) => p.id === cartItem.productId)!
              return {
                productId:   cartItem.productId,
                quantity:    cartItem.quantity,
                priceAtTime: product.price,
              }
            }),
          },
        },
        include: {
          items:   { include: { product: true } },
          address: true,
        },
      })

      for (const cartItem of cartItems) {
        await tx.product.update({
          where: { id: cartItem.productId },
          data:  { stock: { decrement: cartItem.quantity } },
        })
      }

      return newOrder
    })

    await server.redis.del(cartKey(userId))
    return reply.code(201).send({ order })
  })

  // ── GET /orders ────────────────────────────────────────────────────────────
  server.get("/orders", async (req, reply) => {
    const orders = await server.prisma.order.findMany({
      where:   { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
      take:    50,
      include: {
        items:   { include: { product: true } },
        address: true,
      },
    })
    return reply.send({ orders })
  })

  // ── GET /orders/:id ────────────────────────────────────────────────────────
  server.get<{ Params: { id: string } }>("/orders/:id", {
    schema: { params: idParam },
  }, async (req, reply) => {
    const order = await server.prisma.order.findFirst({
      where:   { id: req.params.id, userId: req.user.userId },
      include: {
        items:   { include: { product: true } },
        address: true,
      },
    })

    if (!order) return reply.code(404).send({ error: "Order not found." })
    return reply.send({ order })
  })
}