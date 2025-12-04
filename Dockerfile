# Combined Dockerfile for Backend + Frontend
FROM node:20-alpine AS base

# Install dependencies for running multiple processes, nginx, and envsubst
RUN apk add --no-cache dumb-init nginx gettext

WORKDIR /app

# ============================================
# Backend Dependencies
# ============================================
FROM base AS backend-deps
WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --only=production

# ============================================
# Frontend Dependencies
# ============================================
FROM base AS frontend-deps
WORKDIR /app/client

# Copy frontend package files
COPY client/package*.json ./
RUN npm ci

# ============================================
# Frontend Build
# ============================================
FROM base AS frontend-builder
WORKDIR /app/client

# Copy dependencies from frontend-deps
COPY --from=frontend-deps /app/client/node_modules ./node_modules
COPY client/ .

# Build Next.js application
RUN npm run build

# ============================================
# Final Production Image
# ============================================
FROM base AS production

WORKDIR /app

# Copy backend dependencies and code
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/

# Copy frontend build (Next.js standalone structure)
# Next.js standalone creates: .next/standalone/ directory
# Copy the contents of standalone directory directly to client/
COPY --from=frontend-builder /app/client/.next/standalone/. ./client/
# Copy static files (standalone references these)
COPY --from=frontend-builder /app/client/.next/static ./client/.next/static
# Copy public files
COPY --from=frontend-builder /app/client/public ./client/public

# Copy start script and nginx config
COPY start.sh /app/start.sh
COPY nginx.conf /etc/nginx/nginx.conf
RUN chmod +x /app/start.sh

# Expose port 8080 (nginx will route /api to backend:8000 and / to frontend:3000)
EXPOSE 8080

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/start.sh"]
