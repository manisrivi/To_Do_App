# Stage 1: Build the React application with Vite
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies based on package lockfile
COPY package*.json ./
RUN npm ci

# Copy configuration and source files
COPY tsconfig.json vite.config.ts index.html ./
COPY public ./public
COPY src ./src

# Build production static assets into /app/dist
RUN npm run build

# Stage 2: Serve static assets with Nginx
FROM nginx:alpine

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
