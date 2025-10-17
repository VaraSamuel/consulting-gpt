# Consulting GPT Frontend

A [Next.js](https://nextjs.org) application for health technology assessment and analysis, built with TypeScript, Tailwind CSS, and modern React patterns.

## 🐳 Docker Development Setup

This project uses Docker for consistent development environments. Follow these steps to get started:

### Prerequisites

1. **Install Docker Desktop**

   - Download and install Docker Desktop from: https://www.docker.com/products/docker-desktop/
   - Make sure Docker is running before proceeding

2. **Clone the Repository**
   ```bash
   git clone https://github.com/zubairAbubakar/consulting-gpt-frontend.git
   cd consulting-gpt-frontend
   ```

### Environment Configuration

3. **Create Environment File**

   Create a `.env` file in the project root with the following variables:

   ```bash
   # API Configuration
   NEXT_PUBLIC_API_URL=http://host.docker.internal:8000/api/v1
   NEXT_PUBLIC_API_VERSION=v1

   # Development Environment
   NODE_ENV=development

   # Optional: Add any API keys or secrets here
   # NEXT_PUBLIC_SOME_API_KEY=your_api_key_here
   # DATABASE_URL=your_database_connection_string
   ```

   **Important Environment Variables:**

   - `NEXT_PUBLIC_API_URL`: Backend API endpoint (use `host.docker.internal` for Docker networking)
   - `NEXT_PUBLIC_API_VERSION`: API version identifier
   - `NODE_ENV`: Development environment setting

### Running the Application

4. **Start the Development Server**

   ```bash
   docker-compose up
   ```

   This will:

   - Build the Docker image (first time only)
   - Install dependencies
   - Start the Next.js development server
   - Enable hot reloading for code changes

5. **Access the Application**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Commands

**Stop the Application:**

```bash
docker-compose down
```

**Rebuild the Container (after dependency changes):**

```bash
docker-compose up --build
```

**View Logs:**

```bash
docker-compose logs -f
```

**Run Commands Inside Container:**

```bash
# Run tests
docker-compose exec frontend npm test

# Run linting
docker-compose exec frontend npm run lint

# Format code
docker-compose exec frontend npm run format
```

## 🛠️ Alternative: Local Development

If you prefer running without Docker:

1. **Install Node.js 20+**
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Start Development Server:**
   ```bash
   npm run dev
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run format` - Format code with Prettier

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── components/         # Reusable React components
│   ├── technology/         # Technology-specific pages and components
│   └── page.tsx           # Home page
├── components/ui/          # UI component library
├── types/                  # TypeScript type definitions
├── actions/               # Server actions
├── __tests__/             # Test files
├── docker-compose.yml     # Docker development setup
├── Dockerfile            # Docker image configuration
└── .env                  # Environment variables (create this)
```

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Linting**: ESLint with Next.js configuration
- **Formatting**: Prettier

Run all quality checks:

```bash
npm run quality
```

## 🚀 Deployment

The application can be deployed to various platforms:

- **Vercel**: Recommended for Next.js applications
- **Docker**: Production-ready Docker image available
- **Cloud Platforms**: AWS, GCP, Azure compatible

For production deployment, ensure all environment variables are properly configured in your deployment platform.

## 📚 Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Testing**: Jest, React Testing Library, Playwright
- **Development**: Docker, ESLint, Prettier, Husky
