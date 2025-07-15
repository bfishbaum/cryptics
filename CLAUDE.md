# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload (runs on http://localhost:5173/)
- `npm run build` - Build for production (runs TypeScript compilation then Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run install-frontend` - Install frontend dependencies

## Docker Commands

- `npm run docker:up` - Start the application with PostgreSQL database
- `npm run docker:down` - Stop the application and database
- `npm run docker:build` - Build Docker image for production

## Architecture Overview

This is a cryptogram puzzle website built with React + TypeScript + Vite:

- **Frontend Framework**: React 19 with TypeScript and React Router for navigation
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Clean white minimalistic design with CSS modules
- **Database**: PostgreSQL (in Docker) with mock service for development
- **Routing**: React Router with routes for Main, Puzzle, Archive, and Submission pages

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── CryptogramGame.tsx    # Main game component with input boxes
│   │   └── Header.tsx           # Navigation header
│   ├── pages/              # Page components
│   │   ├── MainPage.tsx         # Home page with latest puzzle
│   │   ├── PuzzlePage.tsx       # Individual puzzle page
│   │   ├── ArchivePage.tsx      # Archive with pagination
│   │   └── SubmissionPage.tsx   # Admin submission form
│   ├── services/           # Business logic
│   │   └── database.ts          # Database service (mock for development)
│   ├── types/              # TypeScript definitions
│   │   └── cryptogram.ts        # Cryptogram types and enums
│   ├── utils/              # Utility functions
│   │   └── validation.ts        # Solution validation logic
│   └── styles/             # CSS files
│       ├── globals.css          # Global styles
│       └── CryptogramGame.css   # Game-specific styles
├── public/                 # Static assets
├── package.json            # Frontend dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── eslint.config.js        # ESLint configuration
```

## Key Features

- **CryptogramGame Component**: Interactive puzzle with input boxes, spaces, and hyphens
- **Smart Answer Checking**: Ignores spaces and hyphens when comparing user input to solution
- **Navigation**: Header with links to Home, Archive, and Submit pages
- **Validation**: Solution validation ensures lowercase letters, spaces, and hyphens only
- **Admin Panel**: Password-protected submission form (password: "admin123")
- **Database**: Mock service that simulates PostgreSQL queries with pagination
- **Responsive Design**: Clean white boxes with rounded corners and black borders
- **Testing**: Comprehensive test suite with Vitest and React Testing Library

## Development Setup

- Uses ESLint with TypeScript, React Hooks, and React Refresh plugins
- TypeScript configuration split between `tsconfig.app.json` (app code) and `tsconfig.node.json` (build tools)
- Vite configured with React plugin for fast refresh during development
- Testing setup with Vitest, React Testing Library, and jsdom environment
- Docker configuration includes PostgreSQL database with sample data

## Answer Checking Logic

The `checkAnswer` function in `src/utils/answerCheck.ts` implements smart answer comparison:

- **Ignores spaces and hyphens**: User only needs to type letters, not punctuation
- **Case insensitive**: Accepts both uppercase and lowercase input
- **Validates completeness**: Checks if all letter positions are filled
- **Comprehensive testing**: 43 test cases covering various scenarios

## Database Schema

```sql
CREATE TABLE cryptograms (
    id SERIAL PRIMARY KEY,
    puzzle TEXT NOT NULL,
    solution TEXT NOT NULL,
    explanation TEXT,
    source VARCHAR(20) NOT NULL,
    difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
    date_added TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```