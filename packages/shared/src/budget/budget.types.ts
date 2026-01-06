export type BudgetCategory = 
    | "lodging"
    | "food"
    | "transport"
    | "activities"
    | "other";

export interface SetStopBudgetPlanDto {
    // ampount per category, optional = no budget set
    amounts: Partial<Record<BudgetCategory, number>>;
}

export interface CreateExpenseDto {
    category: BudgetCategory;
    amount: number;
    occurredAt?: string; // YYYY-MM-DD (optional)
    note?: string;
}