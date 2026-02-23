# 🐳 Docker Setup Guide

## Quick Start

```bash
# Start all services (database, API, frontend)
cd infra
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

## Services

- **Database** (PostgreSQL 16): `localhost:5432`
- **API** (NestJS): `localhost:3000`
- **Web** (Vite + React): `localhost:5173`

## Hot Reload

Both API and frontend support hot reload! Changes to source files are automatically detected:

### Backend Hot Reload
- `apps/api/src/**` - NestJS auto-reloads on save
- `apps/api/prisma/**` - Schema changes require manual migration
- `packages/shared/src/**` - Shared types reload automatically

### Frontend Hot Reload
- `apps/web/src/**` - Vite HMR (instant updates)
- `apps/web/vite.config.ts` - Requires container restart
- `packages/shared/src/**` - Shared types reload automatically

## Database Migrations

```bash
# Run pending migrations
docker compose exec api yarn prisma migrate deploy

# Create new migration
docker compose exec api yarn prisma migrate dev --name your_migration_name

# Reset database (⚠️ deletes all data)
docker compose exec api yarn prisma migrate reset
```

## Rebuilding

```bash
# Rebuild API after package.json changes
docker compose build api
docker compose up -d api

# Rebuild frontend after package.json changes
docker compose build web
docker compose up -d web

# Rebuild everything
docker compose build
docker compose up -d
```

## Useful Commands

```bash
# Shell into API container
docker compose exec api sh

# Shell into Web container
docker compose exec web sh

# View API logs
docker compose logs -f api

# View Web logs
docker compose logs -f web

# Restart single service
docker compose restart api
docker compose restart web

# Remove everything including volumes
docker compose down -v
```

## Environment Variables

### API (.env in apps/api)
```env
DATABASE_URL=postgresql://tc:tc@db:5432/travel_companion
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### Web (.env in apps/web)
```env
VITE_API_BASE_URL=http://localhost:3000
```

## Network

All services run in a custom `tc-network` bridge network:
- Services can communicate using service names (e.g., `db`, `api`)
- Ports are exposed to host for development access

## Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :3000  # or :5173, :5432

# Stop the conflicting process or change port in docker-compose.yml
```

### Database connection issues
```bash
# Ensure database is ready
docker-compose ps db

# Check logs
docker-compose logs db

# Wait for database to be ready before starting API
```

### Hot reload not working
```bash
# Ensure volumes are mounted correctly
docker compose config

# Restart the service
docker compose restart api
# or
docker compose restart web
```

### Clean slate
```bash
# Stop everything
docker compose down

# Remove volumes
docker compose down -v

# Rebuild and start
docker compose build
docker compose up -d
```

## Production

For production, create separate Dockerfiles with:
- Multi-stage builds
- Compiled/built assets
- No development dependencies
- Proper security hardening
- Health checks

Example production command:
```bash
docker compose -f docker-compose.prod.yml up -d
```
