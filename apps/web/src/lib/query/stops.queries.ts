import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stopsApi, type CreateStopDto, type UpdateStopDto } from '../api/stops.api';
import { queryKeys } from './keys';

export function useStops(tripId: string) {
  return useQuery({
    queryKey: queryKeys.stops.list(tripId),
    queryFn: () => stopsApi.getStops(tripId),
    enabled: !!tripId,
  });
}

export function useStop(stopId: string) {
  return useQuery({
    queryKey: queryKeys.stops.detail(stopId),
    queryFn: () => stopsApi.getStop(stopId),
    enabled: !!stopId,
  });
}

export function useCreateStop() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ tripId, data }: { tripId: string; data: CreateStopDto }) =>
      stopsApi.createStop(tripId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stops.list(variables.tripId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.trips.summary(variables.tripId) });
    },
  });
}

export function useUpdateStop() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ stopId, data }: { stopId: string; data: UpdateStopDto }) =>
      stopsApi.updateStop(stopId, data),
    onSuccess: (updatedStop) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stops.detail(updatedStop.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.stops.list(updatedStop.tripId) });
    },
  });
}

export function useDeleteStop() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (stopId: string) => stopsApi.deleteStop(stopId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stops.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.trips.all });
    },
  });
}
