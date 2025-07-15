# Arthik.ai - AI-Powered Financial Trading Assistant

## Overview

Arthik.ai is a full-stack web application that provides AI-powered financial trading assistance. It combines a React frontend with an Express backend to deliver intelligent market insights, trading recommendations, and real-time financial analysis through a conversational chat interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with custom styling
- **Animations**: Framer Motion for smooth transitions

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **AI Integration**: OpenAI GPT-4o for financial analysis

## Key Components

### Database Schema
- **Users**: Stores user profiles with subscription tiers (free, pro, enterprise)
- **Chat Sessions**: Manages conversation threads between users and AI
- **Chat Messages**: Stores individual messages with role-based content (user/assistant)
- **Sessions**: Handles authentication session storage

### Authentication System
- Replit Auth integration with OpenID Connect
- Session-based authentication with PostgreSQL storage
- User profile management with subscription tracking
- Protected routes requiring authentication

### AI Chat System
- OpenAI GPT-4o integration for financial analysis
- Context-aware conversations with financial expertise
- Automatic chat session title generation
- Message persistence and retrieval

### UI Components
- Comprehensive component library using shadcn/ui
- Responsive design with mobile-first approach
- Dark/light theme support through CSS variables
- Accessibility features with Radix UI primitives

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, creating or updating user profiles
2. **Chat Initialization**: Users can create new chat sessions or continue existing ones
3. **Message Processing**: User messages are sent to the backend, processed by OpenAI, and responses are stored
4. **Real-time Updates**: TanStack Query manages cache invalidation and real-time data synchronization
5. **Session Management**: All interactions are tracked and persisted for future reference

## External Dependencies

### Core Infrastructure
- **Database**: Neon serverless PostgreSQL
- **Authentication**: Replit Auth service
- **AI Service**: OpenAI API (GPT-4o model)

### Development Tools
- **Build System**: Vite with TypeScript support
- **Database Migrations**: Drizzle Kit for schema management
- **Code Quality**: TypeScript for type safety

### UI Libraries
- **Component System**: Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React icons
- **Animations**: Framer Motion

## Deployment Strategy

### Development Environment
- Hot module replacement via Vite
- TypeScript compilation checking
- Database schema synchronization with Drizzle

### Production Build
- Frontend: Vite builds optimized static assets
- Backend: ESBuild bundles server code for Node.js
- Database: Migrations applied via Drizzle Kit

### Environment Configuration
- Database URL for PostgreSQL connection
- OpenAI API key for AI functionality
- Replit Auth credentials for authentication
- Session secret for security

The application follows a monorepo structure with shared TypeScript definitions, enabling type safety across the full stack while maintaining clear separation between client and server code.

## Recent Changes: Latest modifications with dates

### July 15, 2025 - Local Development Setup
- Created comprehensive local development setup structure
- Added .env and .env.example files for environment configuration
- Created automated setup scripts for Unix/Linux/macOS, Windows, and Node.js
- Added Docker and Docker Compose configuration for containerized development
- Created detailed README.md and LOCAL_DEVELOPMENT.md documentation
- Added health check endpoint at /health for monitoring
- Improved project structure for better local development experience
- Added troubleshooting guides and setup instructions

### Local Development Structure
- Environment variables properly configured in .env files
- Database setup scripts for PostgreSQL
- OpenAI API key configuration
- Authentication setup for local development
- Multiple deployment options (native, Docker, automated scripts)
- Comprehensive documentation and troubleshooting guides