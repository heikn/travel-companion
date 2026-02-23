import { http } from './http';
import type { BudgetCategory } from '@tc/shared';

export interface BudgetPlan {
  stopId: string;
  amounts: Partial<Record<BudgetCategory, number>>;
}

export interface SetBudgetPlanDto {
  amounts: Partial<Record<BudgetCategory, number>>;
}

export interface Expense {
  id: string;
  stopId: string;
  category: BudgetCategory;
  amount: number;
  occurredAt?: string;
  note?: string;
}

export interface CreateExpenseDto {
  category: BudgetCategory;
  amount: number;
  occurredAt?: string;
  note?: string;
}

export interface StopSummary {
  stopId: string;
  totals: {
    plan: number;
    actual: number;
    diff: number;
  };
  perCategory: Record<BudgetCategory, {
    plan: number;
    actual: number;
    diff: number;
  }>;
}

export const budgetApi = {
  getBudgetPlan: (stopId: string) => 
    http.get<BudgetPlan>(`/stops/${stopId}/budget`),
  
  setBudgetPlan: (stopId: string, data: SetBudgetPlanDto) => 
    http.put<BudgetPlan>(`/stops/${stopId}/budget`, data),
  
  getExpenses: (stopId: string) => 
    http.get<Expense[]>(`/stops/${stopId}/expenses`),
  
  createExpense: (stopId: string, data: CreateExpenseDto) => 
    http.post<Expense>(`/stops/${stopId}/expenses`, data),
  
  getStopSummary: (stopId: string) => 
    http.get<StopSummary>(`/stops/${stopId}/summary`),
};
