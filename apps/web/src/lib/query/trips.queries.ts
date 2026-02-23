import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsApi, type CreateTripDto } from '../api/trips.api';
import { queryKeys } from './keys';

export function useTrips() {
  return useQuery({
    queryKey: queryKeys.trips.list(),
    queryFn: tripsApi.getTrips,
  });
}

export function useTrip(tripId: string) {
  return useQuery({
    queryKey: queryKeys.trips.detail(tripId),
    queryFn: () => tripsApi.getTrip(tripId),
    enabled: !!tripId,
  });
}

export function useTripSummary(tripId: string) {
  return useQuery({
    queryKey: queryKeys.trips.summary(tripId),
    queryFn: () => tripsApi.getTripSummary(tripId),
    enabled: !!tripId,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTripDto) => tripsApi.createTrip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trips.list() });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tripId: string) => tripsApi.deleteTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trips.list() });
    },
  });
}
