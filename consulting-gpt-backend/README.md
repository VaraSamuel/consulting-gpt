# Consulting GPT Backend

FastAPI backend for the Consulting GPT application with Docker-based development environment.

## Project Structure

```
app/
├── api/
│   ├── endpoints/       # API route handlers
├── core/               # Core functionality, config
├── services/           # External service integrations
├── models/            # Database models
└── db/                # Database configuration
```

## Prerequisites

### 1. Install Docker

Download and install Docker Desktop for your operating system:

- **Windows/Mac**: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Linux**: Follow the [official installation guide](https://docs.docker.com/engine/install/)

Verify installation by running:

```bash
docker --version
docker-compose --version
```

## Quick Start Guide

### 1. Clone the Repository

```bash
git clone <repository-url>
cd consulting-gpt-backend
```

### 2. Create Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```bash
# App Settings
PROJECT_NAME=Consulting GPT
API_V1_STR=/api/v1

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=11520  # 8 days

# Database (for Docker development - keep these values)
POSTGRES_SERVER=db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=consulting_gpt

# External APIs (required for full functionality)
OPENAI_API_KEY=sk-your-openai-api-key-here
SERPAPI_API_KEY=your-serpapi-key-here

# CORS (adjust frontend URL if needed)
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

### 3. Start the Development Environment

```bash
# Start all services (backend + database)
docker compose up --build

# Or run in detached mode (background)
docker compose up --build -d
```

The application will be available at:

- **API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **Database**: localhost:5432

### 4. Verify Installation

Test the API is running:

```bash
curl http://localhost:8000/health
```

## Development Workflow

### Starting/Stopping Services

```bash
# Start development environment
make dev

# Stop all services
make dev-down
# or
docker compose down

# View logs
docker compose logs backend
docker compose logs db

# View real-time logs
docker compose logs -f backend
```

### Running Tests

```bash
# Run all tests
make test

# Run specific test types
make test-unit
make test-integration
make test-e2e

# Run tests with coverage
make test-coverage
```

### Code Quality

```bash
# Format code
make format

# Run linting
make lint
```

### Environment Variables Reference

| Variable               | Description                           | Example                     |
| ---------------------- | ------------------------------------- | --------------------------- |
| `SECRET_KEY`           | JWT secret key for authentication     | `your-secret-key-here`      |
| `OPENAI_API_KEY`       | OpenAI API key for GPT functionality  | `sk-...`                    |
| `SERPAPI_API_KEY`      | SerpAPI key for search functionality  | `your-serpapi-key`          |
| `POSTGRES_SERVER`      | Database server (use `db` for Docker) | `db`                        |
| `POSTGRES_USER`        | Database username                     | `postgres`                  |
| `POSTGRES_PASSWORD`    | Database password                     | `postgres`                  |
| `POSTGRES_DB`          | Database name                         | `consulting_gpt`            |
| `BACKEND_CORS_ORIGINS` | Allowed frontend URLs                 | `["http://localhost:3000"]` |

### API Keys Setup

1. **OpenAI API Key**:

   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Navigate to API Keys section
   - Create a new API key
   - Add to `.env` file as `OPENAI_API_KEY`

2. **SerpAPI Key**:
   - Sign up at [SerpAPI](https://serpapi.com/)
   - Get your API key from dashboard
   - Add to `.env` file as `SERPAPI_KEY`

## Development

### Project Dependencies

Dependencies are managed in `requirements.txt` and automatically installed during Docker build.

To add new dependencies:

1. Add the package to `requirements.txt`
2. Rebuild the Docker image: `docker compose up --build`

### Database Management

The PostgreSQL database runs in a Docker container with persistent data:

```bash
# Connect to database
docker exec -it consulting-gpt-db psql -U postgres -d consulting_gpt

# View database logs
docker compose logs db

# Reset database (removes all data)
docker compose down -v
docker compose up --build
```

### Code Style

This project follows PEP 8 guidelines and uses:

- **Black** for code formatting
- **isort** for import sorting
- **flake8** for linting

### Troubleshooting

#### Common Issues

1. **Port already in use**:

   ```bash
   # Stop conflicting services
   docker compose down
   # Or change ports in docker-compose.yml
   ```

2. **Database connection issues**:

   ```bash
   # Ensure database is running
   docker compose logs db
   # Reset database
   docker compose down -v && docker compose up --build
   ```

3. **API key errors**:

   - Verify `.env` file exists and contains valid API keys
   - Check API key format and permissions

4. **Permission errors**:
   ```bash
   # Fix file permissions (Linux/Mac)
   sudo chown -R $USER:$USER .
   ```

#### Getting Help

- Check container logs: `docker compose logs <service-name>`
- View all services status: `docker compose ps`
- Access backend container: `docker exec -it consulting-gpt-backend bash`

## Available Commands

| Command                 | Description                      |
| ----------------------- | -------------------------------- |
| `make dev`              | Start development environment    |
| `make dev-down`         | Stop development environment     |
| `make test`             | Run all tests                    |
| `make test-unit`        | Run unit tests only              |
| `make test-integration` | Run integration tests only       |
| `make test-coverage`    | Run tests with coverage report   |
| `make lint`             | Run code linting                 |
| `make format`           | Format code with Black and isort |
| `make help`             | Show all available commands      |
