export type BudgetCategory = "lodging" | "food" | "transport" | "activities" | "other";
export interface SetStopBudgetPlanDto {
    amounts: Partial<Record<BudgetCategory, number>>;
}
export interface CreateExpenseDto {
    category: BudgetCategory;
    amount: number;
    occurredAt?: string;
    note?: string;
}
