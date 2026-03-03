FROM python:3.11-slim

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# Set PYTHONPATH
ENV PYTHONPATH=/app

# Expose port (good practice for Traefik visibility)
EXPOSE 8000

# Start migrations (if fail, continue) then start server
CMD ["sh", "-c", "python -m alembic upgrade head || echo 'Migration failed, continuing...' && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"]
