# =========================
# 1) Build Frontend
# =========================
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build


# =========================
# 2) Build Backend
# =========================
FROM node:20-alpine AS backend-build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/ .


# =========================
# 3) Final Runtime Image
# =========================
FROM node:20-alpine

WORKDIR /app

# Install dependencies to serve frontend build
RUN npm install -g serve supervisor

# Copy backend code + node_modules
COPY --from=backend-build /app/backend /app/backend

# Copy frontend dist build
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Copy supervisor config
COPY supervisor.conf /etc/supervisor/conf.d/supervisor.conf

EXPOSE 5000 3000

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisor.conf"]
