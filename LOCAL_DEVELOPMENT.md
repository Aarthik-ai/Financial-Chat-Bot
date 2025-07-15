# Local Development Guide - Arthik.ai

This guide will help you set up and run Arthik.ai on your local machine.

## Quick Start

### Option 1: Automated Setup (Recommended)

**For Unix/Linux/macOS:**
```bash
chmod +x scripts/setup-local.sh
./scripts/setup-local.sh
```

**For Windows:**
```cmd
scripts\setup-local.bat
```

**For Node.js:**
```bash
node scripts/setup-local.js
```

### Option 2: Docker Setup

```bash
# Copy environment variables
cp .env.example .env
# Edit .env with your OpenAI API key

# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app
```

### Option 3: Manual Setup

1. **Prerequisites**
   - Node.js 18+
   - PostgreSQL 12+
   - Git

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Setup Database**
   ```bash
   createdb arthik_db
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/arthik_db
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=arthik_db

# OpenAI Configuration (Required)
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

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run preview` - Build and preview production version
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Database Setup

### PostgreSQL Installation

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### Database Creation

```bash
# Create database
createdb arthik_db

# Or using psql
psql -U postgres
CREATE DATABASE arthik_db;
\q
```

### Database Migration

```bash
# Push schema to database
npm run db:push

# Open database GUI (optional)
npm run db:studio
```

## Getting API Keys

### OpenAI API Key (Required)

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add to `.env`

### Replit Auth (Optional)

For full authentication features:
1. Create a Replit account
2. Go to https://replit.com/account
3. Create an OAuth application
4. Add credentials to `.env`

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
├── scripts/              # Setup and utility scripts
├── .env                  # Environment variables
├── .env.example          # Environment template
└── README.md            # Project documentation
```

## Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Access Application**
   - Frontend: http://localhost:5000
   - Health Check: http://localhost:5000/health

3. **Make Changes**
   - Frontend changes auto-reload
   - Backend changes auto-restart

4. **Database Changes**
   ```bash
   # After modifying shared/schema.ts
   npm run db:push
   ```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running: `pg_isready`
   - Verify DATABASE_URL in `.env`
   - Ensure database exists: `createdb arthik_db`

2. **OpenAI API Error**
   - Check API key is valid
   - Verify key has sufficient credits
   - Ensure key is properly set in `.env`

3. **Port Already in Use**
   - Change PORT in `.env`
   - Kill existing processes: `lsof -ti:5000 | xargs kill`

4. **Permission Errors**
   - Make scripts executable: `chmod +x scripts/*.sh`
   - Check file permissions

5. **Node.js Version**
   - Ensure Node.js 18+ is installed
   - Use nvm to manage versions: `nvm use 18`

### Debugging

1. **Check Logs**
   ```bash
   # View server logs
   npm run dev

   # View database logs
   tail -f /var/log/postgresql/postgresql-*.log
   ```

2. **Database Debugging**
   ```bash
   # Access database
   psql -d arthik_db

   # View tables
   \dt

   # View schema
   \d table_name
   ```

3. **Network Issues**
   ```bash
   # Check port usage
   lsof -i :5000

   # Test API endpoints
   curl http://localhost:5000/health
   ```

## Production Deployment

### Build for Production

```bash
# Build application
npm run build

# Start production server
npm run start
```

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
OPENAI_API_KEY=your_production_openai_key
SESSION_SECRET=your_secure_session_secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
- Check the troubleshooting section
- Search existing issues
- Create a new issue with details

## License

This project is licensed under the MIT License.