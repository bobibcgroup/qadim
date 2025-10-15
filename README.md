# Qadim — The Memory of Lebanon

A production-ready Next.js application that lets users verify any Lebanese or Phoenician historical, political, or cultural claim across thousands of years using AI-powered research and verified sources.

## Features

- **AI-Powered Research**: RAG pipeline with OpenAI integration for intelligent historical research
- **Source Verification**: Grouped citations with authority levels (Official, Scholarly, Press, Community, Claims)
- **Dual Persona**: Neutral academic tone or "Zaatar Mode" with Lebanese cultural warmth
- **Multi-language Support**: English, Arabic (RTL), and French
- **Debate Mode**: Compare two historical claims with evidence scoring
- **Timeline View**: Interactive historical timeline with event exploration
- **Community Notes**: User-contributed corrections and additional sources
- **Authentication**: Google OAuth integration with role-based access
- **Real-time Processing**: Redis + BullMQ for background job processing
- **Vector Search**: PostgreSQL with pgvector for semantic document retrieval

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS (RTL support)
- **Backend**: Next.js API routes, tRPC for type-safe APIs
- **Database**: PostgreSQL with pgvector extension for embeddings
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: OpenAI GPT-4 and text-embedding-3-small
- **Queue System**: Redis + BullMQ for background processing
- **Storage**: S3-compatible storage (R2/MinIO)
- **Infrastructure**: Docker + docker-compose
- **Testing**: Playwright, Vitest

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Google OAuth credentials
- OpenAI API key

### 1. Environment Setup

Copy the environment template and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/qadim?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Redis
REDIS_URL="redis://localhost:6379"

# S3 Storage (for production)
S3_ENDPOINT="https://your-account.r2.cloudflarestorage.com"
S3_REGION="auto"
S3_ACCESS_KEY_ID="your-s3-access-key"
S3_SECRET_ACCESS_KEY="your-s3-secret-key"
S3_BUCKET_NAME="qadim-documents"

# Feature Flags
FEATURE_DEBATE_MODE="true"
FEATURE_TIMELINE_MODE="true"
FEATURE_COMMUNITY_NOTES="true"
FEATURE_ADS="false"
```

### 2. Development Setup

```bash
# Install dependencies
npm install

# Start development services with Docker
docker-compose up -d postgres redis minio

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:push

# Seed the database with sample data
npm run db:seed

# Start the development server
npm run dev
```

### 3. Production Setup

```bash
# Build and start all services
docker-compose up --build

# Or build and start specific services
docker-compose up --build web worker
```

## Database Schema

The application uses a comprehensive schema with:

- **Users**: Authentication and persona preferences
- **Sources**: Historical documents with authority levels and credibility scores
- **Docs**: Document content with vector embeddings for semantic search
- **Questions & Answers**: Q&A pairs with confidence and controversy metrics
- **Community Notes**: User-contributed corrections and additions

## API Endpoints

### tRPC Routers

- `question.*` - Question management and retrieval
- `answer.*` - Answer generation and management
- `source.*` - Source verification and management
- `community.*` - Community notes and moderation
- `rag.*` - RAG pipeline and AI processing

### REST Endpoints

- `GET /api/health` - Health check for all services
- `POST /api/auth/signin` - Authentication endpoints
- `GET /api/trpc/*` - tRPC API routes

## Architecture

### RAG Pipeline

1. **Document Ingestion**: Process historical documents and generate embeddings
2. **Query Processing**: Convert user questions to embeddings
3. **Vector Search**: Find relevant documents using pgvector similarity search
4. **Answer Generation**: Use OpenAI to synthesize answers with citations
5. **Citation Grouping**: Organize sources by authority level and credibility

### Background Processing

- **RAG Processing Queue**: Handle question answering asynchronously
- **Document Ingestion Queue**: Process new documents and generate embeddings
- **Email Notifications Queue**: Send user notifications

## Deployment

### Railway (Recommended) 🚂

Railway is perfect for Qadim with managed PostgreSQL + pgvector, Redis, and automatic deployments:

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to Railway"
git push origin main

# 2. Connect to Railway
# Go to railway.app → New Project → Deploy from GitHub

# 3. Add services: PostgreSQL + Redis + Web
# 4. Set environment variables (see railway-deploy.md)
# 5. Deploy automatically!
```

[**📖 Complete Railway Deployment Guide**](./railway-deploy.md)

### Vercel + External Database

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Use external PostgreSQL (Neon, Supabase) and Redis (Upstash)

### Docker

```bash
# Build production image
docker build -t qadim .

# Run with external database
docker run -p 3000:3000 \
  -e DATABASE_URL="your-production-db-url" \
  -e REDIS_URL="your-redis-url" \
  qadim
```

### Self-hosted

```bash
# Using docker-compose
docker-compose up -d
```

## Development

### Database Commands

```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:migrate     # Create and run migrations
npm run db:seed        # Seed database with sample data
npm run db:studio      # Open Prisma Studio
npm run db:reset       # Reset database
```

### Testing

```bash
npm test              # Run unit tests
npm run test:e2e      # Run Playwright tests
npm run test:coverage # Run tests with coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for preserving Lebanese heritage and history**