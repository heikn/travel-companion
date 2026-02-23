# Development Dockerfile for NestJS API
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy workspace root package files
COPY package.json yarn.lock ./

# Copy all workspace packages
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install dependencies
RUN yarn install

# Set working directory to API
WORKDIR /app/apps/api

# Generate Prisma Client
RUN yarn prisma generate

# Expose port
EXPOSE 3000

# Start in development mode
CMD ["yarn", "start:dev"]
