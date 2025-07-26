# Cryptics API - Docker + Express.js

A RESTful API built with Express.js and PostgreSQL in Docker containers for the Cryptics puzzle game.

## Setup

### Prerequisites
- [Docker](https://www.docker.com/get-started) and Docker Compose
- Node.js 20+ (for local development without Docker)

### Quick Start with Docker

1. Clone and navigate to the API directory:
```bash
cd api
```

2. Start the application with Docker Compose:
```bash
npm run docker:up
```

This will:
- Build the API Docker image
- Start PostgreSQL with persistent data volumes
- Start the API server
- Initialize the database with sample data

3. Access the API:
- API: http://localhost:3001/api
- Health check: http://localhost:3001/health
- Database: localhost:5432

### Local Development (without Docker)

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Start a local PostgreSQL instance and create the database

4. Build and start:
```bash
npm run build
npm start
```

### Docker Commands

```bash
# Start services
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs

# Rebuild and start
npm run docker:build && npm run docker:up
```

### Database Schema

The database is automatically initialized with this schema:

```sql
CREATE TABLE cryptograms (
    id SERIAL PRIMARY KEY,
    puzzle TEXT NOT NULL,
    solution TEXT NOT NULL,
    explanation TEXT,
    source VARCHAR(20) NOT NULL CHECK (source IN ('USER_SUBMITTED', 'AI_GENERATED', 'OFFICIAL')),
    difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
    date_added TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints

All endpoints are prefixed with `/api`:

- `GET /api/cryptograms` - Get all cryptograms
- `GET /api/cryptograms/{id}` - Get specific cryptogram
- `GET /api/cryptograms/latest` - Get latest cryptogram  
- `GET /api/cryptograms/paginated?page=1&limit=20` - Get paginated cryptograms
- `POST /api/cryptograms` - Create new cryptogram

### Data Persistence

PostgreSQL data is persisted using Docker volumes:
- Volume name: `cryptics_postgres_data`
- Data persists across container restarts
- To reset data: `docker volume rm cryptics_postgres_data`

### Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - API server port (default: 3001)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password

### Health Checks

Both services include health checks:
- API: `GET /health`
- PostgreSQL: `pg_isready` command

### Troubleshooting

1. **Port conflicts**: Change ports in `docker-compose.yml`
2. **Database connection issues**: Check if PostgreSQL container is healthy
3. **Permission issues**: Ensure Docker has proper permissions
4. **Data reset**: Remove the volume with `docker volume rm cryptics_postgres_data`