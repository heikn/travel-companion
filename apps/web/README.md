# Travel Companion - Web Frontend

React + TypeScript + Vite frontend for Travel Companion API.

## Features

- 🗺️ **Trip Management**: Create and manage trips
- 📍 **Stops**: Add stops (cities) to your trips
- 💰 **Budget Planning**: Set budget plans per category
- 📊 **Expense Tracking**: Track actual expenses
- 📈 **Summaries**: View budget vs actual spending

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for routing
- **TanStack Query** (React Query) for server state
- **React Hook Form** + **Zod** for forms
- **Tailwind CSS** for styling

## Project Structure

```
src/
├── app/                    # App shell & providers
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers.tsx
├── lib/
│   ├── api/               # API client layer
│   │   ├── http.ts
│   │   ├── trips.api.ts
│   │   ├── stops.api.ts
│   │   └── budget.api.ts
│   ├── query/             # React Query hooks
│   │   ├── keys.ts
│   │   ├── trips.queries.ts
│   │   ├── stops.queries.ts
│   │   └── budget.queries.ts
│   └── utils/             # Utilities
│       ├── money.ts
│       ├── dates.ts
│       └── cn.ts
├── features/              # Feature modules
│   ├── trips/
│   ├── stops/
│   └── budget/
├── components/            # Shared components
│   ├── ui/               # UI primitives
│   └── layout/           # Layout components
└── styles/
    └── globals.css
```

## Getting Started

### Prerequisites

- Node.js 18+
- yarn (workspace support)

### Installation

```bash
# Install dependencies (from monorepo root with yarn workspaces)
cd /home/hessu/Projects/travel-companion
yarn install
```

### Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Development

```bash
# Start dev server
yarn workspace @tc/web dev

# Or from apps/web directory
cd apps/web
yarn dev

# Build for production
yarn workspace @tc/web build

# Preview production build
yarn workspace @tc/web preview
```

The app will be available at `http://localhost:5173`

## API Integration

All API calls go through:
1. **`lib/api/*.api.ts`** - Type-safe API functions
2. **`lib/query/*.queries.ts`** - React Query hooks
3. Components consume hooks, never call API directly

## Key Principles

✅ **Separation of concerns**: API ↔ React Query ↔ Components  
✅ **Type safety**: Shared types from `@tc/shared`  
✅ **Form validation**: React Hook Form + Zod schemas  
✅ **Optimistic updates**: React Query cache invalidation  
✅ **Clean architecture**: Features are self-contained  

## Routes

- `/` - Trips list
- `/trips/:tripId` - Trip detail with stops
- `/stops/:stopId` - Stop detail with budget & expenses

## Development Notes

- TypeScript errors about missing modules will disappear after `pnpm install`
- Vite proxy forwards `/api/*` to backend (see `vite.config.ts`)
- React Query DevTools available in development mode
- Tailwind CSS for rapid UI development

## TODO / Future Enhancements

- [ ] Delete trip/stop functionality
- [ ] Edit trip/stop names
- [ ] Date range for trips
- [ ] Currency conversion
- [ ] Export to PDF/CSV
- [ ] Dark mode
- [ ] Mobile responsiveness improvements
