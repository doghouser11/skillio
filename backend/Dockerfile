FROM python:3.11-slim

WORKDIR /app

# Инсталираме системни зависимости за компилиране на някои Python пакети
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копираме requirements.txt от подпапката backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копираме цялото съдържание на папка backend в работната директория /app
COPY backend/ .

# Добавяме текущата директория към PYTHONPATH, за да може Python да намери папка "app"
ENV PYTHONPATH=/app

# Стартираме миграциите и сървъра чрез "python -m", което е по-стабилно в Docker
CMD ["sh", "-c", "python -m alembic upgrade head && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"]
