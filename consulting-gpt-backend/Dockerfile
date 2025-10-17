# -------- Base (production) --------
FROM python:3.11-slim

# Prevent .pyc files + ensure stdout/stderr are unbuffered
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

WORKDIR /app

# Install only minimal system deps.
# - libpq5: runtime lib for psycopg (if you use psycopg/psycopg2)
# - curl: for HEALTHCHECK (optional but useful on Railway)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 curl \
 && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt .
RUN python -m pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Optional health endpoint: implement GET /health in your app
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s \
  CMD curl -fsS http://localhost:8000/health || exit 1

# Start FastAPI (adjust module if your entrypoint differs)
# If your app is "app = FastAPI()" in main.py at repo root, this is correct:
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
