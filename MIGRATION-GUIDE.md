# Migration Guide: Docker PostgreSQL → GitHub Pages + Azure SQL Database

## Overview

This project has been migrated from a Docker-based PostgreSQL setup to a cloud-native deployment using GitHub Pages for the frontend and Azure SQL Database for the backend.

## Changes Made

### Backend Changes

1. **Database Driver**: Replaced `pg` (PostgreSQL) with `mssql` (SQL Server)
2. **Database Connection**: Updated to use Azure SQL Database connection string
3. **SQL Syntax**: Modified queries to use SQL Server syntax:
   - `LIMIT` → `TOP` and `OFFSET...FETCH NEXT`
   - `SERIAL` → `IDENTITY(1,1)`
   - `RETURNING` → `OUTPUT INSERTED.*`
   - Parameter placeholders: `$1` → `@param`

### Frontend Changes

1. **Environment Configuration**: Updated to point to Azure Web App URL
2. **Build Configuration**: Added GitHub Pages base path support
3. **Vite Config**: Modified for production deployment

### Infrastructure Changes

1. **GitHub Actions**: Added workflows for:
   - Frontend deployment to GitHub Pages
   - Backend deployment to Azure Web App
2. **Database Schema**: Created Azure SQL-compatible initialization script
3. **Environment Files**: Updated for Azure SQL Database connection

## Deployment Steps

### 1. Azure SQL Database Setup

1. Create Azure SQL Database
2. Run `init-azure.sql` to create schema and sample data
3. Note connection details for environment variables

### 2. Azure Web App Setup

1. Create Azure Web App for Node.js
2. Configure environment variables:
   ```
   DB_SERVER=your-server.database.windows.net
   DB_NAME=cryptics
   DB_USER=your-username
   DB_PASSWORD=your-password
   PORT=3001
   ```
3. Download publish profile for GitHub Actions

### 3. GitHub Configuration

1. Enable GitHub Pages in repository settings
2. Add GitHub Secrets:
   - `VITE_API_URL`: Your Azure Web App URL
   - `AZURE_WEBAPP_NAME`: Your Azure Web App name
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: Contents of publish profile

### 4. Deploy

1. Push changes to main branch
2. GitHub Actions will automatically:
   - Build and deploy frontend to GitHub Pages
   - Build and deploy backend to Azure Web App

## Local Development

For local development, you can still use the Docker setup:

```bash
npm run docker:up
```

Or set up local environment variables and run:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## File Structure Changes

```
New files:
├── .github/workflows/
│   ├── deploy.yml           # GitHub Pages deployment
│   └── deploy-backend.yml   # Azure Web App deployment
├── backend/.env.example     # Azure SQL configuration
├── init-azure.sql          # Azure SQL initialization
└── MIGRATION-GUIDE.md      # This file

Modified files:
├── backend/
│   ├── package.json        # Updated dependencies
│   └── src/database.ts     # Azure SQL implementation
├── frontend/
│   ├── .env.example        # Azure Web App URL
│   ├── vite.config.ts      # GitHub Pages base path
│   └── src/services/database.ts # Fixed TypeScript types
└── README.md              # Updated deployment instructions
```

## Testing

The migration has been tested with:
- ✅ Frontend build successful
- ✅ Backend build successful
- ✅ Linting passes
- ✅ TypeScript compilation clean

## Next Steps

1. Create Azure SQL Database
2. Create Azure Web App
3. Configure GitHub repository settings
4. Add GitHub Secrets
5. Push to main branch to trigger deployment

## Rollback

If you need to rollback to the Docker setup:
1. Restore `backend/package.json` to use `pg` instead of `mssql`
2. Restore `backend/src/database.ts` to use PostgreSQL syntax
3. Use `docker-compose.yml` for deployment