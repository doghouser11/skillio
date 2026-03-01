FROM node:18-alpine

WORKDIR /app

# Инсталираме само най-необходимото за билда
RUN apk add --no-cache libc6-compat

# Копираме само файловете за зависимостите
COPY package.json package-lock.json* ./

# Оптимизирана инсталация за слаби сървъри
# --network-timeout спира прекъсванията, --prefer-offline пести ресурси
RUN npm ci --network-timeout=100000 --prefer-offline --no-audit

# Копираме останалия код
COPY . .

# Изключваме телеметрията на Next.js (пести малко RAM)
ENV NEXT_TELEMETRY_DISABLED=1

# Билдваме приложението
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
