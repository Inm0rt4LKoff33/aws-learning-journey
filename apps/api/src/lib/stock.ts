import { FastifyInstance } from "fastify"

/**
 * Calculates how many units of a product are currently sitting
 * in ALL active user carts in Redis.
 *
 * Cart keys follow the pattern: cart:{userId}
 * Each cart is a Redis Hash: { [productId]: quantity }
 */
export async function getUnitsInCarts(
  server: FastifyInstance,
  productId: string,
  excludeUserId?: string  // optionally ignore the requesting user's own cart
): Promise<number> {
  // Scan for all cart keys — SCAN is non-blocking unlike KEYS
  const cartKeys = await scanKeys(server.redis, "cart:*")

  let total = 0

  for (const key of cartKeys) {
    // Skip the current user's cart so they don't get warned about their own reservation
    if (excludeUserId && key === `cart:${excludeUserId}`) continue

    const qty = await server.redis.hget(key, productId)
    if (qty) total += parseInt(qty, 10)
  }

  return total
}

/**
 * Returns stock availability info for a product.
 * Used by GET /products/:id to attach low-stock warnings to the response.
 *
 * Thresholds:
 *   availableStock <= 0  → out of stock
 *   availableStock <= 2  → low stock warning
 */
export async function getStockInfo(
  server: FastifyInstance,
  productId: string,
  actualStock: number,
  requestingUserId?: string
): Promise<{
  availableStock: number
  lowStock: boolean
  outOfStock: boolean
}> {
  const unitsInOtherCarts = await getUnitsInCarts(
    server,
    productId,
    requestingUserId
  )

  const availableStock = Math.max(0, actualStock - unitsInOtherCarts)

  return {
    availableStock,
    lowStock:    availableStock > 0 && availableStock <= 2,
    outOfStock:  availableStock === 0,
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function scanKeys(redis: FastifyInstance["redis"], pattern: string): Promise<string[]> {
  const keys: string[] = []
  let cursor = "0"

  do {
    const [nextCursor, batch] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100)
    cursor = nextCursor
    keys.push(...batch)
  } while (cursor !== "0")

  return keys
}