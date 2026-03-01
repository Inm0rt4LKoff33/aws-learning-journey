import fp from "fastify-plugin"
import { FastifyInstance, FastifyError } from "fastify"

// ── Global Error Handler ───────────────────────────────────────────────────────
// Catches ALL errors — schema validation failures, JWT errors, manual throws,
// and unhandled 500s — and normalizes them to one consistent shape:
//
//   { statusCode: number, error: string }
//
// Without this, Fastify's schema validation errors return a different shape
// than manually thrown errors, making the frontend handle two formats.

export default fp(async (server: FastifyInstance) => {
  server.setErrorHandler((err: FastifyError, req, reply) => {

    // 5xx = real error, 4xx = expected client mistake
    if (!err.statusCode || err.statusCode >= 500) {
      server.log.error({ err, url: req.url, method: req.method }, "Unhandled server error")
    } else {
      server.log.warn({ err, url: req.url, method: req.method }, "Client error")
    }

    // ── Schema validation failures ────────────────────────────────────────────
    // Fastify sets err.validation when JSON Schema fails.
    // We normalize the first message into a human-readable string.
    if (err.validation) {
      const first   = err.validation[0]
      const field   = first.instancePath.replace(/^\//, "") || "request"
      const message = first.message ?? "is invalid"
      return reply.code(400).send({
        statusCode: 400,
        error: `Validation error: ${field} ${message}`,
      })
    }

    // ── JWT errors ────────────────────────────────────────────────────────────
    if (
      err.code === "FST_JWT_NO_AUTHORIZATION_IN_HEADER" ||
      err.code === "FST_JWT_AUTHORIZATION_TOKEN_INVALID" ||
      err.code === "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED"
    ) {
      return reply.code(401).send({
        statusCode: 401,
        error: "Unauthorized. Please log in.",
      })
    }

    // ── Known HTTP errors (thrown manually in routes) ─────────────────────────
    if (err.statusCode && err.statusCode < 500) {
      return reply.code(err.statusCode).send({
        statusCode: err.statusCode,
        error: err.message,
      })
    }

    // ── Unknown 500s — never leak internals in production ─────────────────────
    const message =
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred. Please try again."
        : err.message

    return reply.code(500).send({ statusCode: 500, error: message })
  })
})