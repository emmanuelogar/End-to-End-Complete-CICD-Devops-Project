# -------------------------
# 1. Builder stage
# -------------------------
FROM node:18-alpine AS builder

# Set work directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy the source code
COPY . .

# Build Next.js app (standalone output)
RUN npm run build

# -------------------------
# 2. Runner stage
# -------------------------
FROM node:18-alpine AS runner

# Set work directory
WORKDIR /app

# Copy Next.js output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Start Next.js app
CMD ["node", "server.js"]
    