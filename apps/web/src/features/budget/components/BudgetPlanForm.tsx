import { useForm } from 'react-hook-form';
import { useBudgetPlan, useSetBudgetPlan } from '@/lib/query/budget.queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BudgetCategory } from '@tc/shared';
import { useEffect } from 'react';

const CATEGORIES: BudgetCategory[] = ['lodging', 'food', 'transport', 'activities', 'other'];

const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  lodging: 'Lodging',
  food: 'Food',
  transport: 'Transport',
  activities: 'Activities',
  other: 'Other',
};

interface BudgetPlanFormProps {
  stopId: string;
}

export function BudgetPlanForm({ stopId }: BudgetPlanFormProps) {
  const { data: plan } = useBudgetPlan(stopId);
  const setPlan = useSetBudgetPlan();
  const { register, handleSubmit, reset } = useForm<Record<BudgetCategory, string>>();

  useEffect(() => {
    if (plan?.amounts) {
      const formData: Record<string, string> = {};
      for (const cat of CATEGORIES) {
        formData[cat] = plan.amounts[cat]?.toString() || '';
      }
      reset(formData);
    }
  }, [plan, reset]);

  const onSubmit = async (data: Record<BudgetCategory, string>) => {
    const amounts: Partial<Record<BudgetCategory, number>> = {};
    
    for (const cat of CATEGORIES) {
      const value = parseFloat(data[cat]);
      if (!isNaN(value) && value > 0) {
        amounts[cat] = value;
      }
    }

    try {
      await setPlan.mutateAsync({ stopId, data: { amounts } });
    } catch (error) {
      console.error('Failed to set budget plan:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {CATEGORIES.map((category) => (
        <div key={category}>
          <Label htmlFor={category}>{CATEGORY_LABELS[category]}</Label>
          <Input
            id={category}
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register(category)}
          />
        </div>
      ))}
      <Button type="submit" disabled={setPlan.isPending} className="w-full">
        {setPlan.isPending ? 'Saving...' : 'Save Budget Plan'}
      </Button>
    </form>
  );
}
