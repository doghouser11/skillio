FROM node:20-alpine

WORKDIR /app

# Копираме файловете
COPY package*.json ./
RUN npm install

COPY . .

# Билдваме за продукция
RUN npm run build

# Експлицитно казваме на Next.js че сме в production
ENV NODE_ENV=production

EXPOSE 3000

# Директно стартиране на сървъра
CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
