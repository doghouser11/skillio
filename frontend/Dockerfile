FROM node:18-alpine
WORKDIR /app

# Копираме package.json
COPY package*.json ./
# Използваме --force за npm install, за да избегнем стари версии
RUN npm install --force

# Копираме кода
COPY . .

# ИЗТРИВАМЕ КЕША НА NEXT ПРЕДИ БИЛДА
RUN rm -rf .next

RUN npm run build

EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
