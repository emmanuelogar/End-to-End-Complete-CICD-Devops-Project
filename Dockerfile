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
    
    # Copy only the standalone output and static assets
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package*.json ./
    
    # Expose port
    EXPOSE 3000
    
    # Start Next.js app
    CMD ["node", "server.js"]
    