import { useParams, Link } from 'react-router-dom';
import { useStop } from '@/lib/query/stops.queries';
import { useStopSummary } from '@/lib/query/budget.queries';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BudgetPlanForm } from '../budget/components/BudgetPlanForm';
import { ExpensesList } from '../budget/components/ExpensesList';
import { SummaryCard } from '../budget/components/SummaryCard';
import { useState } from 'react';

export function StopDetailPage() {
  const { stopId } = useParams<{ stopId: string }>();
  const { data: stop, isLoading } = useStop(stopId!);
  const { data: summary } = useStopSummary(stopId!);
  const [isBudgetPlanOpen, setIsBudgetPlanOpen] = useState(false);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!stop) {
    return <div className="text-center py-8">Stop not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/trips/${stop.tripId}`}
          className="text-sm text-blue-600 hover:underline mb-2 block"
        >
          ← Back to trip
        </Link>
        <h1 className="text-3xl font-bold">{stop.cityName}</h1>
        <p className="text-gray-600">Stop {stop.order}</p>
      </div>

      {summary && <SummaryCard summary={summary} />}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Budget Plan</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBudgetPlanOpen(!isBudgetPlanOpen)}
              >
                {isBudgetPlanOpen ? '−' : '+'}
              </Button>
            </div>
          </CardHeader>
          {isBudgetPlanOpen && (
            <CardContent>
              <BudgetPlanForm stopId={stopId!} />
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensesList stopId={stopId!} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
