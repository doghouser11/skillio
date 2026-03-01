FROM node:18-alpine

WORKDIR /app

# Системни зависимости
RUN apk add --no-cache libc6-compat

# Копираме файловете за конфигурация
COPY frontend/package*.json ./

# Вместо npm ci, ще ползваме стандартен install, но с ограничения за RAM
# --no-package-lock помага, ако има разминавания в версиите на темплейта
RUN npm install --network-timeout=100000 --prefer-offline --no-audit

# Копираме останалия код
COPY frontend/ ./

ENV NEXT_TELEMETRY_DISABLED=1

# Билдваме (тук е най-големият риск за RAM паметта)
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
