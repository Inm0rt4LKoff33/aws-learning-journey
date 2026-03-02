import { FastifyInstance } from "fastify"
import { Prisma } from "@prisma/client"
import { getStockInfo } from "../lib/stock"
import { idParam, productFilterQuery } from "../lib/schemas" // NEW

export default async function productRoutes(server: FastifyInstance) {

  // ── GET /products ──────────────────────────────────────────────────────────
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
  }>("/products", {
    schema: { querystring: productFilterQuery }, // NEW — validates & bounds query params
  }, async (req, reply) => {
    const {
      game, rarity, condition, search,
      sort  = "name-asc",
      page  = "1",
      limit = "20",
    } = req.query

    const pageNum  = parseInt(page)
    const limitNum = parseInt(limit)
    const skip     = (pageNum - 1) * limitNum

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

    const orderByMap: Record<string, Prisma.ProductOrderByWithRelationInput> = {
      "name-asc":   { name:  Prisma.SortOrder.asc  },
      "name-desc":  { name:  Prisma.SortOrder.desc },
      "price-asc":  { price: Prisma.SortOrder.asc  },
      "price-desc": { price: Prisma.SortOrder.desc },
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      orderByMap[sort] ?? { name: Prisma.SortOrder.asc }

    const [products, total] = await server.prisma.$transaction([
      server.prisma.product.findMany({ where, orderBy, skip, take: limitNum }),
      server.prisma.product.count({ where }),
    ])

    return reply.send({
      products,
      pagination: {
        total,
        page:       pageNum,
        limit:      limitNum,
        totalPages: Math.ceil(total / limitNum),
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
  server.get<{ Params: { id: string } }>("/products/:id", {
    schema: { params: idParam }, // NEW — rejects empty/missing id
  }, async (req, reply) => {
    const product = await server.prisma.product.findUnique({
      where: { id: req.params.id },
    })

    if (!product) return reply.code(404).send({ error: "Product not found." })

    let requestingUserId: string | undefined
    try {
      await req.jwtVerify()
      requestingUserId = req.user.userId
    } catch {
      // Guest
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