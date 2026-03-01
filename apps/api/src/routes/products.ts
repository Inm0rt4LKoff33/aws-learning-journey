import { FastifyInstance } from "fastify"
import { Prisma } from "@prisma/client"
import { getStockInfo } from "../lib/stock"

export default async function productRoutes(server: FastifyInstance) {

  // ── GET /products ──────────────────────────────────────────────────────────
  // Supports: ?game= &rarity= &condition= &sort= &page= &limit=
  server.get<{
    Querystring: {
      game?:      string
      rarity?:    string
      condition?: string
      search?:    string
      sort?:      string
      page?:      string
      limit?:     string
    }
  }>("/products", async (req, reply) => {
    const {
      game, rarity, condition, search,
      sort  = "name-asc",
      page  = "1",
      limit = "20",
    } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const take = parseInt(limit)

    const where: Prisma.ProductWhereInput = {
      ...(game      && { game }),
      ...(rarity    && { rarity }),
      ...(condition && { condition }),
      ...(search    && {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { set:  { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
    }

    // Typed explicitly so "asc"/"desc" resolve to SortOrder literals,
    // not plain strings — this is what was causing the type error
    const orderByMap: Record<string, Prisma.ProductOrderByWithRelationInput> = {
      "name-asc":   { name:  Prisma.SortOrder.asc  },
      "name-desc":  { name:  Prisma.SortOrder.desc },
      "price-asc":  { price: Prisma.SortOrder.asc  },
      "price-desc": { price: Prisma.SortOrder.desc },
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      orderByMap[sort] ?? { name: Prisma.SortOrder.asc }

    const [products, total] = await server.prisma.$transaction([
      server.prisma.product.findMany({ where, orderBy, skip, take }),
      server.prisma.product.count({ where }),
    ])

    return reply.send({
      products,
      pagination: {
        total,
        page:       parseInt(page),
        limit:      take,
        totalPages: Math.ceil(total / take),
      },
    })
  })

  // ── GET /products/featured ─────────────────────────────────────────────────
  server.get("/products/featured", async (_req, reply) => {
    const products = await server.prisma.product.findMany({
      where:   { isFeatured: true },
      orderBy: { name: Prisma.SortOrder.asc },
    })
    return reply.send({ products })
  })

  // ── GET /products/:id ──────────────────────────────────────────────────────
  // Attaches low-stock warning based on soft reservation from Redis carts
  server.get<{ Params: { id: string } }>("/products/:id", async (req, reply) => {
    const product = await server.prisma.product.findUnique({
      where: { id: req.params.id },
    })

    if (!product) return reply.code(404).send({ error: "Product not found." })

    // Optionally read userId from JWT if present (not required for this route)
    let requestingUserId: string | undefined
    try {
      await req.jwtVerify()
      requestingUserId = req.user.userId
    } catch {
      // Guest — no userId to exclude from cart scan
    }

    const stockInfo = await getStockInfo(
      server,
      product.id,
      product.stock,
      requestingUserId
    )

    return reply.send({ product, ...stockInfo })
  })
}