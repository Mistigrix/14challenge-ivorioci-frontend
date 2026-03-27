# ——— Stage 1 : Build ———
FROM node:20-alpine AS builder

WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm ci

# Copie le code source
COPY . .

# Build production
RUN npm run build

# ——— Stage 2 : Serve ———
FROM nginx:alpine AS production

# Copie le build dans nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Config nginx pour React Router (SPA)
RUN echo 'server { \
  listen 80; \
  location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]