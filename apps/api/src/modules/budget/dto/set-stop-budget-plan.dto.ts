import { IsNumber, IsObject, IsOptional } from "class-validator";
import type { SetStopBudgetPlanDto as SharedDto } from "@tc/shared";

class BudgetAmountsDto {
    @IsOptional() @IsNumber() lodging?: number;
    @IsOptional() @IsNumber() food?: number
    @IsOptional() @IsNumber() transport?: number;
    @IsOptional() @IsNumber() activities?: number;
    @IsOptional() @IsNumber() other?: number;
}

export class SetStopBudgetPlanDto implements SharedDto {
    @IsObject()
    amounts!: BudgetAmountsDto;
}