import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatMoney } from '@/lib/utils/money';
import type { StopSummary } from '@/lib/api/budget.api';
import type { BudgetCategory } from '@tc/shared';

const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  lodging: 'Lodging',
  food: 'Food',
  transport: 'Transport',
  activities: 'Activities',
  other: 'Other',
};

interface SummaryCardProps {
  summary: StopSummary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const categories: BudgetCategory[] = ['lodging', 'food', 'transport', 'activities', 'other'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Totals */}
          <div className="grid grid-cols-3 gap-4 pb-4 border-b">
            <div>
              <div className="text-sm text-gray-600">Total Planned</div>
              <div className="text-xl font-bold">{formatMoney(summary.totals.plan)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Actual</div>
              <div className="text-xl font-bold">{formatMoney(summary.totals.actual)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Difference</div>
              <div
                className={`text-xl font-bold ${
                  summary.totals.diff > 0 ? 'text-green-600' : summary.totals.diff < 0 ? 'text-red-600' : ''
                }`}
              >
                {formatMoney(summary.totals.diff)}
              </div>
            </div>
          </div>

          {/* Per Category */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">By Category</h4>
            {categories.map((category) => {
              const cat = summary.perCategory[category];
              if (!cat || (cat.plan === 0 && cat.actual === 0)) return null;

              return (
                <div key={category} className="grid grid-cols-4 gap-2 text-sm">
                  <div className="font-medium">{CATEGORY_LABELS[category]}</div>
                  <div className="text-right">{formatMoney(cat.plan)}</div>
                  <div className="text-right">{formatMoney(cat.actual)}</div>
                  <div
                    className={`text-right ${
                      cat.diff > 0 ? 'text-green-600' : cat.diff < 0 ? 'text-red-600' : ''
                    }`}
                  >
                    {formatMoney(cat.diff)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
