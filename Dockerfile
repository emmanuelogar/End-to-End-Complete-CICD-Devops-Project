# Stage 1: Development/Build Stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install necessary build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all project files
COPY . .

# Set the environment variable to enable mock database behavior
ENV BUILD_WITH_MOCK_DB=true

# Build the Next.js application
RUN npm run build

# Stage 2: Production Stage
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy the standalone build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
