import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetApi, type SetBudgetPlanDto, type CreateExpenseDto } from '../api/budget.api';
import { queryKeys } from './keys';

export function useBudgetPlan(stopId: string) {
  return useQuery({
    queryKey: queryKeys.budget.plan(stopId),
    queryFn: () => budgetApi.getBudgetPlan(stopId),
    enabled: !!stopId,
  });
}

export function useSetBudgetPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ stopId, data }: { stopId: string; data: SetBudgetPlanDto }) =>
      budgetApi.setBudgetPlan(stopId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.plan(variables.stopId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.summary(variables.stopId) });
    },
  });
}

export function useExpenses(stopId: string) {
  return useQuery({
    queryKey: queryKeys.budget.expensesList(stopId),
    queryFn: () => budgetApi.getExpenses(stopId),
    enabled: !!stopId,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ stopId, data }: { stopId: string; data: CreateExpenseDto }) =>
      budgetApi.createExpense(stopId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.expensesList(variables.stopId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.summary(variables.stopId) });
    },
  });
}

export function useStopSummary(stopId: string) {
  return useQuery({
    queryKey: queryKeys.budget.summary(stopId),
    queryFn: () => budgetApi.getStopSummary(stopId),
    enabled: !!stopId,
  });
}
