# Cryptograms - Dynamic Puzzle Website

A dynamic cryptogram puzzle website built with React + TypeScript + Vite, featuring interactive puzzles, admin submission, and Docker deployment.

## Project Structure

```
.
├── frontend/               # React frontend application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
├── api/                   # Azure Functions API
│   ├── src/               # Function source code
│   ├── package.json       # API dependencies
│   ├── host.json          # Functions host configuration
│   └── local.settings.json # Local development settings
├── .github/workflows/     # GitHub Actions workflows
└── package.json          # Root package.json with convenience scripts
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start development servers:**
   ```bash
   # Terminal 1: Frontend
   npm run dev
   # Starts the vite development server
   
   # Terminal 2: API
   #Starts the backend which connects to postgres 
   #should be running on 3001
   docker-compose up
   

   # The admin password starts as admin
   ```

3. **Build for production:**
   ```bash
   npm run build
   npm run build:api
   ```

## Database

The application uses an AWS RDS database with the following schema

```sql
CREATE TABLE cryptograms (
    id INT IDENTITY(1,1) PRIMARY KEY,
    puzzle NVARCHAR(MAX) NOT NULL,
    solution NVARCHAR(MAX) NOT NULL,
    explanation NVARCHAR(MAX),
    source VARCHAR(20) NOT NULL,
    difficulty INT NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
    date_added DATETIME2 DEFAULT SYSDATETIME()
);
```

Running it locally starts a postgres server in docker.

## Deployment
1. **Configure GitHub Environment and Secrets:**
   - Create `github-pages` environment in **Settings > Environments**
   - Add environment secrets:
     - `VITE_API_URL`: Your Azure Function App URL (e.g., `https://your-function-app.azurewebsites.net/api`)
     - `VITE_ADMIN_PASSWORD`: Use the included generate-password-hash.cjs to create the hash of your password.

2. **Deploy:**
   - Push to main branch triggers automatic deployment
   - Frontend deploys to GitHub Pages


### Setting GitHub Secrets

In your repository, go to **Settings > Environments** and create a `github-pages` environment, then add secrets:

```
VITE_API_URL= AWS API endpoint
VITE_ADMIN_PASSWORD=your-secure-password-here
```

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **API**: Express API deployed on AWS ECS + AWS RDS postgres database
- **Styling**: CSS modules with clean white design
- **Deployment**: GitHub Pages + AWS Script
- **Linting**: ESLint with React and TypeScript rules
