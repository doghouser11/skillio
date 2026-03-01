FROM node:18-alpine

WORKDIR /app

# Инсталираме необходимите системни библиотеки
RUN apk add --no-cache libc6-compat

# ВАЖНО: Тъй като context е ".", пътищата трябва да включват "frontend/"
COPY frontend/package.json frontend/package-lock.json* ./

# Оптимизирана инсталация
RUN npm ci --network-timeout=100000 --prefer-offline --no-audit

# Копираме целия код на фронтенда в работната директория
COPY frontend/ ./

ENV NEXT_TELEMETRY_DISABLED=1

# Билдваме
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
