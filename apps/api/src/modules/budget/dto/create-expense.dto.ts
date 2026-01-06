import { IsIn, IsNumber, IsOptional, IsString, Matches, MaxLength } from "class-validator";
import type { BudgetCategory, CreateExpenseDto as SharedDto } from "@tc/shared";

const YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;

export class CreateExpenseDto implements SharedDto{
    @IsIn(["lodging", "food", "transport", "activities", "other"])
    category!: BudgetCategory;

    @IsNumber()
    amount!: number;

    @IsOptional()
    @Matches(YYYY_MM_DD, { message: "occurredAt must be in YYYY-MM-DD format" })
    occurredAt?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    note?: string;
}