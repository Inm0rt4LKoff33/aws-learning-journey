import fp from "fastify-plugin"
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify"
import fastifyJwt from "@fastify/jwt"

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { userId: string; email: string }
    user:    { userId: string; email: string }
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

const jwtPlugin: FastifyPluginAsync = fp(async (server) => {
  server.register(fastifyJwt, {
    secret:   process.env.JWT_SECRET ?? "dev-secret-change-in-production",
    sign:     { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" },
  })

  server.decorate(
    "authenticate",
    async (req: FastifyRequest, reply: FastifyReply) => {
      await req.jwtVerify()

      const token       = req.headers.authorization?.replace("Bearer ", "") ?? ""
      const blacklisted = await server.redis.get(`blacklist:${token}`)

      if (blacklisted) {
        return reply.code(401).send({
          statusCode: 401,
          error:      "Token has been invalidated. Please log in again.",
        })
      }
    }
  )
})

export default jwtPlugin