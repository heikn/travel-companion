# Development Dockerfile for Vite Frontend
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy workspace root package files
COPY package.json yarn.lock ./

# Copy all workspace packages
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Install dependencies
RUN yarn install

# Set working directory to web
WORKDIR /app/apps/web

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server with host flag to allow external access
CMD ["yarn", "dev", "--host", "0.0.0.0"]
