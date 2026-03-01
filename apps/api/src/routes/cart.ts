import { FastifyInstance } from "fastify"
import { Product } from "@prisma/client"

// Cart lives entirely in Redis as a Hash: cart:{userId} → { [productId]: quantity }
// Nothing is persisted to Postgres until POST /orders converts the cart to an order.

type CartItem = Product & { quantity: number }

export default async function cartRoutes(server: FastifyInstance) {

  // All cart routes require auth
  server.addHook("preHandler", server.authenticate)

  const cartKey = (userId: string) => `cart:${userId}`

  // Helper: enrich raw Redis cart hash with product details from Postgres.
  // Explicit return type prevents TypeScript from inferring the spread as any.
  async function getEnrichedCart(userId: string): Promise<CartItem[]> {
    const raw: Record<string, string> = await server.redis.hgetall(cartKey(userId))
    if (!raw || Object.keys(raw).length === 0) return []

    const productIds = Object.keys(raw)
    const products: Product[] = await server.prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    return products.map((p: Product): CartItem => ({
      ...p,
      quantity: parseInt(raw[p.id], 10),
    }))
  }

  // ── GET /cart ──────────────────────────────────────────────────────────────
  server.get("/cart", async (req, reply) => {
    const items = await getEnrichedCart(req.user.userId)
    const subtotal = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0)
    return reply.send({ items, subtotal })
  })

  // ── POST /cart/items ───────────────────────────────────────────────────────
  server.post<{
    Body: { productId: string; quantity?: number }
  }>("/cart/items", {
    schema: {
      body: {
        type: "object",
        required: ["productId"],
        properties: {
          productId: { type: "string" },
          quantity:  { type: "number", minimum: 1, default: 1 },
        },
      },
    },
  }, async (req, reply) => {
    const { productId, quantity = 1 } = req.body

    const product = await server.prisma.product.findUnique({
      where: { id: productId },
    })
    if (!product) return reply.code(404).send({ error: "Product not found." })
    if (product.stock === 0) return reply.code(409).send({ error: "Product is out of stock." })

    const key = cartKey(req.user.userId)
    const current = await server.redis.hget(key, productId)
    const newQty  = (current ? parseInt(current, 10) : 0) + quantity

    if (newQty > product.stock) {
      return reply.code(409).send({
        error: `Only ${product.stock} units available.`,
      })
    }

    await server.redis.hset(key, productId, newQty)
    await server.redis.expire(key, 60 * 60 * 24 * 7)

    return reply.code(201).send({ productId, quantity: newQty })
  })

  // ── PATCH /cart/items/:productId ───────────────────────────────────────────
  server.patch<{
    Params: { productId: string }
    Body:   { quantity: number }
  }>("/cart/items/:productId", {
    schema: {
      body: {
        type: "object",
        required: ["quantity"],
        properties: {
          quantity: { type: "number", minimum: 0 },
        },
      },
    },
  }, async (req, reply) => {
    const { productId } = req.params
    const { quantity }  = req.body
    const key = cartKey(req.user.userId)

    if (quantity === 0) {
      await server.redis.hdel(key, productId)
      return reply.send({ message: "Item removed." })
    }

    const product = await server.prisma.product.findUnique({
      where: { id: productId },
    })
    if (!product) return reply.code(404).send({ error: "Product not found." })

    if (quantity > product.stock) {
      return reply.code(409).send({
        error: `Only ${product.stock} units available.`,
      })
    }

    await server.redis.hset(key, productId, quantity)
    return reply.send({ productId, quantity })
  })

  // ── DELETE /cart/items/:productId ──────────────────────────────────────────
  server.delete<{ Params: { productId: string } }>(
    "/cart/items/:productId",
    async (req, reply) => {
      await server.redis.hdel(cartKey(req.user.userId), req.params.productId)
      return reply.code(204).send()
    }
  )

  // ── DELETE /cart ───────────────────────────────────────────────────────────
  server.delete("/cart", async (req, reply) => {
    await server.redis.del(cartKey(req.user.userId))
    return reply.code(204).send()
  })
}