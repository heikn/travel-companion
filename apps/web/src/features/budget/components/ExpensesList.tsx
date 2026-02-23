import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useExpenses, useCreateExpense } from '@/lib/query/budget.queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatMoney } from '@/lib/utils/money';
import { formatDateLong, getTodayString } from '@/lib/utils/dates';
import type { BudgetCategory } from '@tc/shared';
import { useState } from 'react';

const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  lodging: 'Lodging',
  food: 'Food',
  transport: 'Transport',
  activities: 'Activities',
  other: 'Other',
};

const createExpenseSchema = z.object({
  category: z.enum(['lodging', 'food', 'transport', 'activities', 'other']),
  amount: z.number().positive(),
  occurredAt: z.string().optional(),
  note: z.string().max(200).optional(),
});

type CreateExpenseForm = z.infer<typeof createExpenseSchema>;

interface ExpensesListProps {
  stopId: string;
}

export function ExpensesList({ stopId }: ExpensesListProps) {
  const { data: expenses } = useExpenses(stopId);
  const createExpense = useCreateExpense();
  const [showForm, setShowForm] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateExpenseForm>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      occurredAt: getTodayString(),
    },
  });

  const onSubmit = async (data: CreateExpenseForm) => {
    try {
      await createExpense.mutateAsync({ stopId, data });
      reset({ occurredAt: getTodayString() });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  return (
    <div className="space-y-4">
      {expenses && expenses.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium">{CATEGORY_LABELS[expense.category]}</div>
                {expense.note && (
                  <div className="text-sm text-gray-600">{expense.note}</div>
                )}
                {expense.occurredAt && (
                  <div className="text-xs text-gray-500">
                    {formatDateLong(expense.occurredAt)}
                  </div>
                )}
              </div>
              <div className="font-semibold">{formatMoney(expense.amount)}</div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-4 border rounded-lg">
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              {...register('category')}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="occurredAt">Date</Label>
            <Input
              id="occurredAt"
              type="date"
              {...register('occurredAt')}
            />
          </div>
          <div>
            <Label htmlFor="note">Note (optional)</Label>
            <Input
              id="note"
              {...register('note')}
              placeholder="e.g., Dinner at restaurant"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createExpense.isPending} className="flex-1">
              {createExpense.isPending ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      ) : (
        <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
          + Add Expense
        </Button>
      )}
    </div>
  );
}
