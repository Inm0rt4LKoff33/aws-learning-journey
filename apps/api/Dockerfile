# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install OpenSSL — required by Prisma query engine on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY prisma ./prisma

# Generate Prisma client with Alpine-compatible binary
# binaryTargets in schema.prisma must include "linux-musl-openssl-3.0.x"
RUN npx prisma generate

COPY src ./src
RUN npm run build

# ── Stage 2: Production ────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

# Install OpenSSL in the production image too — the query engine needs it at runtime
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

# Non-root user for ECS security best practices
RUN addgroup -g 1001 -S nodejs && \
    adduser  -S nodeuser -u 1001 -G nodejs

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist               ./dist
COPY --from=builder /app/node_modules/.prisma  ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma  ./node_modules/@prisma
COPY prisma ./prisma

USER nodeuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "dist/index.js"]