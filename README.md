# Arthik.ai - AI-Powered Financial Trading Assistant

A full-stack web application that provides AI-powered financial trading assistance through a conversational chat interface.

## Features

- 🤖 AI-powered financial analysis and trading advice
- 💬 Real-time chat interface with OpenAI GPT-4o
- 📊 Market insights and trading recommendations
- 🔐 Secure authentication with Replit Auth
- 💳 Subscription-based pricing tiers
- 📱 Responsive design for all devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS with shadcn/ui components
- TanStack Query for state management
- Wouter for routing
- Framer Motion for animations

### Backend
- Node.js with Express.js
- PostgreSQL with Drizzle ORM
- OpenAI GPT-4o integration
- Replit Auth for authentication
- Session-based authentication

## Prerequisites

Before running locally, ensure you have:

- Node.js 18 or higher
- PostgreSQL database
- OpenAI API key
- Git

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd arthik-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Create a PostgreSQL database:

```bash
# Using psql
createdb arthik_db

# Or using Docker
docker run --name arthik-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=arthik_db -p 5432:5432 -d postgres:15
```

### 4. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/arthik_db
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=arthik_db

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Authentication Configuration (Optional for local development)
SESSION_SECRET=your-random-session-secret-at-least-32-characters-long
REPL_ID=your-repl-id-here
REPLIT_DOMAINS=localhost:5000,127.0.0.1:5000
ISSUER_URL=https://replit.com/oidc

# Application Configuration
NODE_ENV=development
PORT=5000
```

### 5. Database Migration

Push the schema to your database:

```bash
npm run db:push
```

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## API Keys Setup

### OpenAI API Key
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and add to your `.env` file

### Replit Auth (Optional for local development)
For full authentication features:
1. Create a Replit account
2. Set up OAuth application
3. Add credentials to `.env`

## Project Structure

```
arthik-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component
│   └── index.html         # HTML entry point
├── server/                # Express backend
│   ├── db.ts             # Database configuration
│   ├── index.ts          # Server entry point
│   ├── openai.ts         # OpenAI integration
│   ├── replitAuth.ts     # Authentication setup
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database operations
│   └── vite.ts           # Vite development setup
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and types
├── .env                  # Environment variables
├── .env.example          # Environment template
├── package.json          # Dependencies and scripts
├── drizzle.config.ts     # Database configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── vite.config.ts        # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI responses | Yes |
| `SESSION_SECRET` | Secret for session encryption | Yes |
| `REPL_ID` | Replit OAuth client ID | No* |
| `REPLIT_DOMAINS` | Allowed domains for auth | No* |
| `NODE_ENV` | Environment mode | No |
| `PORT` | Server port | No |

*Required for full authentication features

## Features

### Landing Page
- Hero section with compelling copy
- Feature highlights
- Statistics and testimonials
- Call-to-action buttons

### Chat Interface
- Real-time AI conversations
- Financial trading expertise
- Message history
- Quick action buttons

### Pricing Page
- Three subscription tiers
- Feature comparison
- Upgrade functionality
- FAQ section

## Deployment

### Local Production Build

```bash
npm run build
npm run preview
```

### Environment Setup for Production

Set production environment variables:
- Set `NODE_ENV=production`
- Use production database URL
- Configure proper session secret
- Set up authentication properly

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify DATABASE_URL is correct
   - Ensure database exists

2. **OpenAI API Error**
   - Verify API key is valid
   - Check API key has sufficient credits
   - Ensure key has correct permissions

3. **Authentication Issues**
   - For local development, authentication might not work fully
   - Check REPLIT_DOMAINS includes your local URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.