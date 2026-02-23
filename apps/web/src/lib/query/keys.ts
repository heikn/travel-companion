// Query key factory
export const queryKeys = {
  trips: {
    all: ['trips'] as const,
    lists: () => [...queryKeys.trips.all, 'list'] as const,
    list: () => [...queryKeys.trips.lists()] as const,
    details: () => [...queryKeys.trips.all, 'detail'] as const,
    detail: (tripId: string) => [...queryKeys.trips.details(), tripId] as const,
    summary: (tripId: string) => [...queryKeys.trips.detail(tripId), 'summary'] as const,
  },
  stops: {
    all: ['stops'] as const,
    lists: () => [...queryKeys.stops.all, 'list'] as const,
    list: (tripId: string) => [...queryKeys.stops.lists(), tripId] as const,
    details: () => [...queryKeys.stops.all, 'detail'] as const,
    detail: (stopId: string) => [...queryKeys.stops.details(), stopId] as const,
  },
  budget: {
    all: ['budget'] as const,
    plans: () => [...queryKeys.budget.all, 'plan'] as const,
    plan: (stopId: string) => [...queryKeys.budget.plans(), stopId] as const,
    expenses: () => [...queryKeys.budget.all, 'expenses'] as const,
    expensesList: (stopId: string) => [...queryKeys.budget.expenses(), stopId] as const,
    summaries: () => [...queryKeys.budget.all, 'summary'] as const,
    summary: (stopId: string) => [...queryKeys.budget.summaries(), stopId] as const,
  },
};
