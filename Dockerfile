# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Add Python and build tools for bcrypt and other native dependencies
RUN apk add --no-cache python3 make g++ git

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client for development
RUN npx prisma generate

# Expose development port
EXPOSE 3000

# Development command
CMD ["npm", "run", "dev"]

# Production build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Add Python and build tools for bcrypt and other native dependencies
RUN apk add --no-cache python3 make g++ git

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma client and build
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/r3_test"
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production system dependencies
RUN apk add --no-cache python3 make g++

# Copy necessary files
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Install production dependencies only
RUN npm ci --only=production

# Generate Prisma client for production
RUN npx prisma generate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]