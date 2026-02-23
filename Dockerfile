# Skillio Platform - Production Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN adduser --disabled-password --gecos '' --uid 1000 skillio && \
    chown -R skillio:skillio /app
USER skillio

# Copy application files
COPY --chown=skillio:skillio . .

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Ensure database is writable
RUN touch /app/activities.db && chmod 664 /app/activities.db

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python3 -c "import http.client; conn=http.client.HTTPConnection('localhost:8080'); conn.request('GET', '/'); r=conn.getresponse(); exit(0 if r.status==200 else 1)"

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHON_ENV=production

# Run the application
CMD ["python3", "complete_platform.py"]