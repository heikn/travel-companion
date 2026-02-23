import { useTrips } from '@/lib/query/trips.queries';
import { TripList } from './components/TripList';
import { CreateTripDialog } from './components/CreateTripDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function TripsPage() {
  const { data: trips, isLoading, error } = useTrips();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return <div className="text-center py-8">Loading trips...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading trips: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Button onClick={() => setIsCreateOpen(true)}>Create Trip</Button>
      </div>

      <TripList trips={trips || []} />

      <CreateTripDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}
