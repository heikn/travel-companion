import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { BudgetService } from "./budget.service";
import { SetStopBudgetPlanDto } from "./dto/set-stop-budget-plan.dto";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { StopsService } from "../stops/stops.service";

@Controller()
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Put("stops/:stopId/budget")
  setStopPlan(@Param("stopId") stopId: string, @Body() dto: SetStopBudgetPlanDto) {
    return this.budgetService.setPlan(stopId, dto.amounts);
  }

  @Get("stops/:stopId/budget")
  getStopPlan(@Param("stopId") stopId: string) {
    return this.budgetService.getPlan(stopId);
  }

  @Post("stops/:stopId/expenses")
  addExpense(@Param("stopId") stopId: string, @Body() dto: CreateExpenseDto) {
    return this.budgetService.addExpense(stopId, dto);
  }

  @Get("stops/:stopId/expenses")
  listExpenses(@Param("stopId") stopId: string) {
    return this.budgetService.listExpenses(stopId);
  }

  @Get("stops/:stopId/summary")
  getStopSummary(@Param("stopId") stopId: string) {
    return this.budgetService.getStopSummary(stopId);
  }

  @Get("trips/:tripId/summary")
  getTripSummary(@Param("tripId") tripId: string) {
    return this.budgetService.getTripSummaryByTripId(tripId);
}
}
