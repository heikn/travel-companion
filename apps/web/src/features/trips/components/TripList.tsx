import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import type { Trip } from '@/lib/api/trips.api';

interface TripListProps {
  trips: Trip[];
}

export function TripList({ trips }: TripListProps) {
  if (trips.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-gray-600">
          No trips yet. Create your first trip to get started!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <Link key={trip.id} to={`/trips/${trip.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold">{trip.name}</h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
