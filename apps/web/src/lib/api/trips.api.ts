import { http } from './http';

export interface Trip {
  id: string;
  name: string;
}

export interface CreateTripDto {
  name: string;
}

export interface TripSummary {
  totals: {
    plan: number;
    actual: number;
    diff: number;
  };
  stops: Array<{
    stopId: string;
    totals: {
      plan: number;
      actual: number;
      diff: number;
    };
    perCategory: Record<string, {
      plan: number;
      actual: number;
      diff: number;
    }>;
  }>;
}

export const tripsApi = {
  getTrips: () => http.get<Trip[]>('/trips'),
  
  getTrip: (tripId: string) => http.get<Trip>(`/trips/${tripId}`),
  
  createTrip: (data: CreateTripDto) => http.post<Trip>('/trips', data),
  
  deleteTrip: (tripId: string) => http.delete<void>(`/trips/${tripId}`),
  
  getTripSummary: (tripId: string) => http.get<TripSummary>(`/trips/${tripId}/summary`),
};
