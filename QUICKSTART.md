# 🚀 Quick Start Guide

## Option 1: Docker (Recommended) 🐳

The easiest way to run everything:

```bash
cd infra
./start.sh
```

That's it! Everything runs in Docker with hot reload:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **Database**: localhost:5432

See `infra/README.md` for more Docker commands.

## Option 2: Manual Setup (Local Development)

### Frontend Setup & Run

### 1. Install Dependencies

```bash
# From monorepo root with yarn workspaces
cd /home/hessu/Projects/travel-companion
yarn install
```

### 2. Start Development Server

```bash
# Option 1: From root
yarn workspace @tc/web dev

# Option 2: From apps/web
cd apps/web
yarn dev
```

Frontend runs at: **http://localhost:5173**

### 3. Environment

Make sure `apps/web/.env` exists:
```env
VITE_API_BASE_URL=http://localhost:3000
```

## Backend (API)

### 1. Database Setup

```bash
cd apps/api
yarn prisma migrate dev
```

### 2. Start API Server

```bash
cd apps/api
yarn start:dev
```

API runs at: **http://localhost:3000**

## Test the Full Stack

1. **Start API**: `cd apps/api && yarn start:dev`
2. **Start Web**: `cd apps/web && yarn dev`  
3. Open browser: **http://localhost:5173**

## Quick Test Flow

1. ✅ Create a trip: "Summer Europe Tour"
2. ✅ Add stop: "Berlin" 
3. ✅ Set budget: Food €200, Lodging €300
4. ✅ Add expense: Food €15 "Kebab"
5. ✅ View summary: See actual vs plan

## Monorepo Structure

```
travel-companion/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # React frontend ← YOU ARE HERE
├── packages/
│   └── shared/       # Shared types
└── infra/            # Docker configs
```

## Development Tips

- **Hot reload**: Both dev servers support hot reload
- **Type safety**: Shared types from `@tc/shared`
- **DevTools**: React Query DevTools available in browser
- **API proxy**: Vite proxies `/api/*` → `localhost:3000`

## Troubleshooting

### TypeScript Errors
```bash
yarn install  # Install missing dependencies from root
```

### API Connection Issues
- Check backend is running on port 3000
- Verify `.env` has correct `VITE_API_BASE_URL`
- Check browser console for CORS errors

### Database Issues
```bash
cd apps/api
yarn prisma migrate reset  # Reset DB
yarn prisma migrate dev    # Re-run migrations
```

---

**Happy coding! 🎉**
