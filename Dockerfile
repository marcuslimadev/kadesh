# Frontend Dockerfile
FROM node:22-alpine AS frontend-build

WORKDIR /app

# Instalar dependências necessárias para build
RUN apk add --no-cache python3 make g++

# Copiar package files
COPY package*.json ./

# Instalar dependências e forçar instalação de rollup para musl
RUN npm ci && npm install --save-optional @rollup/rollup-linux-x64-musl

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Nginx para servir frontend
FROM nginx:alpine

# Copiar build do frontend
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
