# Serverless Migration Guide: Backend Server → Azure Functions

## Overview

The project has been migrated from a traditional Express.js backend server to a serverless Azure Functions API. This eliminates the need for a dedicated backend server while maintaining the same functionality.

## Architecture Changes

### Before (Express.js Backend)
```
Frontend → Express.js Server → Azure SQL Database
```

### After (Serverless)
```
Frontend → Azure Functions → Azure SQL Database
```

## Benefits of Serverless Migration

1. **Cost Efficiency**: Pay only for actual usage (~$0.20-$2/month for 10k requests)
2. **Zero Server Management**: No need to maintain or scale servers
3. **Automatic Scaling**: Functions scale automatically based on demand
4. **High Availability**: Built-in redundancy and fault tolerance

## Changes Made

### New API Structure
- **Created** `api/` directory with Azure Functions
- **Removed** `backend/` directory and Express.js server
- **Updated** frontend to use Azure Functions endpoints

### Azure Functions Created
1. **GET /api/cryptograms** - Get all cryptograms
2. **GET /api/cryptograms/{id}** - Get cryptogram by ID
3. **GET /api/cryptograms/latest** - Get latest cryptogram
4. **GET /api/cryptograms/paginated** - Get paginated cryptograms
5. **POST /api/cryptograms** - Create new cryptogram

### Frontend Changes
- **API Base URL**: Updated from Express server to Azure Functions
- **Endpoints**: Simplified paths (removed `/api` prefix as it's handled by Functions)
- **Local Development**: Uses port 7071 (Azure Functions default)

## Deployment Configuration

### GitHub Actions
- **Removed**: `deploy-backend.yml` (Express.js deployment)
- **Added**: `deploy-functions.yml` (Azure Functions deployment)
- **Updated**: Frontend deployment to use Functions API URL

### Environment Variables
```bash
# Azure Functions (local.settings.json)
DB_SERVER=your-server.database.windows.net
DB_NAME=cryptics
DB_USER=your-username
DB_PASSWORD=your-password

# Frontend (.env)
VITE_API_URL=https://your-function-app.azurewebsites.net/api
```

### GitHub Secrets
- `VITE_API_URL`: Your Azure Function App URL
- `AZURE_FUNCTIONAPP_NAME`: Your Function App name
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`: Download from Azure Portal

## File Structure

```
New Structure:
├── api/                        # Azure Functions API
│   ├── src/
│   │   ├── functions/         # Individual function definitions
│   │   ├── database.ts        # Database service
│   │   └── index.ts          # Function exports
│   ├── package.json          # Function dependencies
│   ├── host.json             # Functions configuration
│   └── local.settings.json   # Local development settings
├── frontend/                  # React frontend (unchanged)
└── .github/workflows/
    ├── deploy.yml            # GitHub Pages deployment
    └── deploy-functions.yml   # Azure Functions deployment

Removed:
├── backend/                   # Express.js server (deleted)
└── .github/workflows/
    └── deploy-backend.yml     # Express server deployment (deleted)
```

## Cost Comparison

### Before (Express.js on Azure Web App)
- **Basic App Service**: $13-55/month
- **Always running**: Even with zero traffic
- **Fixed cost**: Regardless of usage

### After (Azure Functions)
- **10k requests/month**: ~$0.20-$2/month
- **Pay-per-use**: Only pay for actual function executions
- **Free tier**: First 1M executions free

## Local Development

### Azure Functions
```bash
cd api
npm install
npm run build
npm start  # Runs on http://localhost:7071
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

## Testing

All functionality has been preserved:
- ✅ All CRUD operations work
- ✅ Frontend builds successfully
- ✅ API builds successfully
- ✅ TypeScript compilation clean
- ✅ Linting passes

## Production Deployment

1. **Create Azure Function App**
   - Runtime: Node.js 18
   - Hosting plan: Consumption (serverless)

2. **Configure Function App**
   - Add database connection environment variables
   - Enable CORS for your domain

3. **Deploy**
   - Push to main branch triggers automatic deployment
   - Frontend → GitHub Pages
   - API → Azure Functions

## Rollback Plan

If needed, the Express.js backend can be restored from git history:
```bash
git checkout <previous-commit> -- backend/
# Restore backend deployment workflow
# Update frontend API URL back to Express server
```

## Next Steps

1. Create Azure Function App
2. Configure environment variables
3. Add GitHub secrets
4. Push to main branch
5. Monitor function performance and costs

The serverless migration is complete and ready for production deployment.