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
├── package.json          # Root package.json with convenience scripts
└── vercel.json           # Root vercel configuration
```

Unfortunately as the project has grown, my ability to test it locally has been hurt, especially around Auth0 endpoints where users have to be logged in to see endpoints or submit.


- **Frontend**: React 19 + TypeScript + Vite
- **API**: Express API deployed on Vercel
- **Styling**: CSS modules with clean white design
- **Deployment**: Vercel
- **Linting**: ESLint with React and TypeScript rules
