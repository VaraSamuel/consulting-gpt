# consulting-gpt-backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

# System headers & tools needed for argon2-cffi, numpy/pandas/sklearn, psycopg
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc libpq-dev libffi-dev curl \
 && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt .
RUN python -m pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

EXPOSE 8000

# Healthcheck expects you have GET /health in main.py
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s \
  CMD curl -fsS http://localhost:8000/health || exit 1

# Start FastAPI (main.py must define: app = FastAPI(...))
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
