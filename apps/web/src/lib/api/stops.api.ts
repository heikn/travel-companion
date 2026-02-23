import { http } from './http';

export interface Stop {
  id: string;
  tripId: string;
  order: number;
  cityName: string;
}

export interface CreateStopDto {
  order: number;
  cityName: string;
}

export interface UpdateStopDto {
  order?: number;
  cityName?: string;
}

export const stopsApi = {
  getStops: (tripId: string) => http.get<Stop[]>(`/trips/${tripId}/stops`),
  
  getStop: (stopId: string) => http.get<Stop>(`/stops/${stopId}`),
  
  createStop: (tripId: string, data: CreateStopDto) => 
    http.post<Stop>(`/trips/${tripId}/stops`, data),
  
  updateStop: (stopId: string, data: UpdateStopDto) => 
    http.put<Stop>(`/stops/${stopId}`, data),
  
  deleteStop: (stopId: string) => http.delete<void>(`/stops/${stopId}`),
};
