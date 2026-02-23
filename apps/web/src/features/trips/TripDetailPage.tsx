import { useParams, Link } from 'react-router-dom';
import { useTrip, useTripSummary } from '@/lib/query/trips.queries';
import { useStops } from '@/lib/query/stops.queries';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/utils/money';
import { useState } from 'react';
import { StopFormDialog } from '../stops/components/StopFormDialog';

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { data: trip, isLoading: tripLoading } = useTrip(tripId!);
  const { data: stops, isLoading: stopsLoading } = useStops(tripId!);
  const { data: summary } = useTripSummary(tripId!);
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);

  if (tripLoading || stopsLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!trip) {
    return <div className="text-center py-8">Trip not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <Link to="/" className="text-sm text-blue-600 hover:underline mb-2 block">
            ← Back to trips
          </Link>
          <h1 className="text-3xl font-bold">{trip.name}</h1>
        </div>
        <Button onClick={() => setIsAddStopOpen(true)} className="hidden sm:inline-flex">
          Add Stop
        </Button>
      </div>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Trip Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Planned</div>
                <div className="text-2xl font-bold">{formatMoney(summary.totals.plan)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Actual</div>
                <div className="text-2xl font-bold">{formatMoney(summary.totals.actual)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Difference</div>
                <div className={`text-2xl font-bold ${summary.totals.diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatMoney(summary.totals.diff)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Stops</h2>
        {stops && stops.length > 0 ? (
          <div className="grid gap-4">
            {stops.map((stop) => (
              <Card key={stop.id}>
                <CardContent className="pt-6">
                  <Link
                    to={`/stops/${stop.id}`}
                    className="flex justify-between items-center hover:bg-gray-50 -m-6 p-6 rounded-lg"
                  >
                    <div>
                      <div className="text-sm text-gray-600">Stop {stop.order}</div>
                      <div className="text-lg font-semibold">{stop.cityName}</div>
                    </div>
                    <Button variant="outline">View Details →</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center text-gray-600">
              No stops yet. Add your first stop!
            </CardContent>
          </Card>
        )}
        
        {/* Add Stop button for mobile - shown below stops */}
        <Button 
          onClick={() => setIsAddStopOpen(true)} 
          className="w-full sm:hidden"
          size="lg"
        >
          + Add Stop
        </Button>
      </div>

      <StopFormDialog
        open={isAddStopOpen}
        onOpenChange={setIsAddStopOpen}
        tripId={tripId!}
        nextOrder={(stops?.length || 0) + 1}
      />
    </div>
  );
}
