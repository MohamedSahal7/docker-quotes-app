# ── Frontend Dockerfile (multi-stage) ───────────────────────────────────────
#
# Stage 1 — BUILD
#   Uses Node.js to install dependencies and compile the React app with Vite.
#   The output lands in /app/dist.
#
# Stage 2 — SERVE
#   Copies only the compiled assets into a minimal Nginx image.
#   No Node.js, no source code — just the static files.
#   Nginx also proxies /api/* requests to the Flask backend container.

#  Stage 1: build    
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps before copying source (better layer caching)
COPY package.json .
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

#  Stage 2: serve 
FROM nginx:alpine

# Replace the default Nginx config with ours (includes /api proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled React app from the build stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
