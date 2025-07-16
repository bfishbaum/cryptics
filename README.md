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
├── init-azure.sql         # Azure SQL Database initialization
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
   
   # Terminal 2: API
   npm run dev:api
   ```

3. **Build for production:**
   ```bash
   npm run build
   npm run build:api
   ```

## Features

- **Interactive Cryptogram Game**: Click-to-focus input boxes with keyboard navigation
- **Smart Answer Checking**: Ignores spaces and hyphens in user input for seamless gameplay
- **Secure Admin Panel**: Password-protected puzzle submission using GitHub secrets
- **Archive System**: Paginated puzzle history with date sorting
- **Responsive Design**: Clean white minimalistic interface
- **Comprehensive Testing**: 43 test cases ensuring functionality works correctly
- **Serverless Deployment**: Ready for cloud deployment with Azure Functions

## Development Commands

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run preview` - Preview production build
- `npm run install-frontend` - Install frontend dependencies

## API Development Commands

- `cd api && npm run build` - Build Azure Functions
- `cd api && npm start` - Start Functions locally (http://localhost:7071)
- `cd api && npm run watch` - Watch mode for development

## Database

The application uses Azure SQL Database with the following schema:

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

## Deployment

### GitHub Pages + Azure Functions + Azure SQL Database

1. **Setup Azure SQL Database:**
   - Create Azure SQL Database
   - Run `init-azure.sql` to initialize schema
   - Note connection details

2. **Create Azure Function App:**
   - Create Function App in Azure Portal
   - Set runtime to Node.js 18
   - Configure environment variables:
     - `DB_SERVER`: your-server.database.windows.net
     - `DB_NAME`: cryptics
     - `DB_USER`: your-username
     - `DB_PASSWORD`: your-password

3. **Configure GitHub Environment and Secrets:**
   - Create `github-pages` environment in **Settings > Environments**
   - Add environment secrets:
     - `VITE_API_URL`: Your Azure Function App URL (e.g., `https://your-function-app.azurewebsites.net/api`)
     - `VITE_ADMIN_PASSWORD`: Secure password for admin panel access
     - `AZURE_FUNCTIONAPP_NAME`: Your Azure Function App name
     - `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`: Download from Azure Portal

4. **Deploy:**
   - Push to main branch triggers automatic deployment
   - Frontend deploys to GitHub Pages
   - API deploys to Azure Functions

**Cost**: ~$6-18/month for 10k requests

## Security

The application implements secure configuration practices:

- **Environment Variables**: All sensitive data stored in environment variables
- **GitHub Secrets**: Admin password and API URLs configured as repository secrets
- **No Hardcoded Secrets**: Default values only for development fallback
- **CORS Configuration**: API properly configured for cross-origin requests

### Setting GitHub Secrets

In your repository, go to **Settings > Environments** and create a `github-pages` environment, then add secrets:

```
VITE_API_URL=https://your-function-app.azurewebsites.net/api
VITE_ADMIN_PASSWORD=your-secure-password-here
AZURE_FUNCTIONAPP_NAME=your-function-app-name
AZURE_FUNCTIONAPP_PUBLISH_PROFILE=<download-from-azure-portal>
```

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **API**: Azure Functions (Node.js 18)
- **Styling**: CSS modules with clean white design
- **Database**: Azure SQL Database
- **Deployment**: GitHub Pages + Azure Functions
- **Linting**: ESLint with React and TypeScript rules
