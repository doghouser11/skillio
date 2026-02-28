FROM node:18-alpine

WORKDIR /app

# Трябва да укажем, че файловете са в папка frontend/
COPY frontend/package*.json ./

# Сега npm install ще намери package.json в /app/
RUN npm install

# Копираме всичко останало от папка frontend в текущата работна директория (/app)
COPY frontend/ .

# Билдваме Next.js
RUN npm run build

EXPOSE 3000

# Стартираме сървъра правилно
CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
