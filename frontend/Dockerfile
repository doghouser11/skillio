FROM node:18-alpine

WORKDIR /app

# Тъй като Base Directory е /frontend, файловете са в текущата папка
COPY package*.json ./
RUN npm install

# Копираме всичко от /frontend в /app
COPY . .

# Билдваме
RUN npm run build

EXPOSE 3000

# Правилно стартиране
CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
