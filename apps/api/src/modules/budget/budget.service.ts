import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import type { BudgetCategory } from "@tc/shared";

const CATEGORIES: BudgetCategory[] = ["lodging", "food", "transport", "activities", "other"];

type ExpenseRow = {
  id: string;
  stopId: string;
  category: BudgetCategory;
  amount: number;
  occurredAt?: string;
  note?: string;
};

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}

  // PUT /stops/:stopId/budget
  async setPlan(stopId: string, amounts: Partial<Record<BudgetCategory, number>>) {
    await this.ensureStop(stopId);

    // sama käyttäytyminen kuin ennen: korvaa stopin suunnitelma
    await this.prisma.budgetPlan.deleteMany({ where: { stopId } });

    const rows = CATEGORIES.flatMap((category) => {
      const amount = amounts?.[category];
      if (typeof amount !== "number") return [];
      return [{ stopId, category, amount }];
    });

    if (rows.length) {
      await this.prisma.budgetPlan.createMany({ data: rows });
    }

    return this.getPlan(stopId);
  }

  // GET /stops/:stopId/budget
  async getPlan(stopId: string) {
    await this.ensureStop(stopId);

    const planRows = await this.prisma.budgetPlan.findMany({
      where: { stopId },
      select: { category: true, amount: true },
    });

    const byCategory: Partial<Record<BudgetCategory, number>> = {};
    for (const row of planRows) {
      byCategory[row.category as BudgetCategory] = row.amount;
    }

    return { stopId, amounts: byCategory };
  }

  // POST /stops/:stopId/expenses
  async addExpense(stopId: string, input: Omit<ExpenseRow, "id" | "stopId">) {
    await this.ensureStop(stopId);

    const created = await this.prisma.expense.create({
      data: {
        stopId,
        category: input.category,
        amount: input.amount,
        occurredAt: input.occurredAt ? new Date(input.occurredAt) : undefined,
        note: input.note ?? undefined,
      },
      select: {
        id: true,
        stopId: true,
        category: true,
        amount: true,
        occurredAt: true,
        note: true,
      },
    });

    return {
      id: created.id,
      stopId: created.stopId,
      category: created.category as BudgetCategory,
      amount: created.amount,
      occurredAt: created.occurredAt?.toISOString(),
      note: created.note ?? undefined,
    };
  }

  // GET /stops/:stopId/expenses
  async listExpenses(stopId: string) {
    await this.ensureStop(stopId);

    const rows = await this.prisma.expense.findMany({
      where: { stopId },
      orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        stopId: true,
        category: true,
        amount: true,
        occurredAt: true,
        note: true,
      },
    });

    return rows.map((r) => ({
      id: r.id,
      stopId: r.stopId,
      category: r.category as BudgetCategory,
      amount: r.amount,
      occurredAt: r.occurredAt?.toISOString(),
      note: r.note ?? undefined,
    }));
  }

  // GET /stops/:stopId/summary
  async getStopSummary(stopId: string) {
    await this.ensureStop(stopId);

    const [planRows, expenseRows] = await this.prisma.$transaction([
      this.prisma.budgetPlan.findMany({
        where: { stopId },
        select: { category: true, amount: true },
      }),
      this.prisma.expense.findMany({
        where: { stopId },
        select: { category: true, amount: true },
      }),
    ]);

    const perCategory: Record<
      BudgetCategory,
      { plan: number; actual: number; diff: number }
    > = {
      lodging: { plan: 0, actual: 0, diff: 0 },
      food: { plan: 0, actual: 0, diff: 0 },
      transport: { plan: 0, actual: 0, diff: 0 },
      activities: { plan: 0, actual: 0, diff: 0 },
      other: { plan: 0, actual: 0, diff: 0 },
    };

    for (const row of planRows) {
      const cat = row.category as BudgetCategory;
      perCategory[cat].plan = row.amount;
    }

    for (const row of expenseRows) {
      const cat = row.category as BudgetCategory;
      perCategory[cat].actual += row.amount;
    }

    for (const category of CATEGORIES) {
      perCategory[category].diff = perCategory[category].plan - perCategory[category].actual;
    }

    const totals = CATEGORIES.reduce(
      (acc, category) => {
        acc.plan += perCategory[category].plan;
        acc.actual += perCategory[category].actual;
        acc.diff += perCategory[category].diff;
        return acc;
      },
      { plan: 0, actual: 0, diff: 0 }
    );

    return { stopId, perCategory, totals };
  }

  // (sisäinen) trip summary pysyy samanlaisena: ottaa stopIds listan
  async getTripSummary(stopIds: string[]) {
    if (!stopIds.length) return { stops: [], totals: { plan: 0, actual: 0, diff: 0 } };

    // Haetaan kaikki planit + expenset yhdellä kertaa
    const [plans, expenses] = await this.prisma.$transaction([
      this.prisma.budgetPlan.findMany({
        where: { stopId: { in: stopIds } },
        select: { stopId: true, category: true, amount: true },
      }),
      this.prisma.expense.findMany({
        where: { stopId: { in: stopIds } },
        select: { stopId: true, category: true, amount: true },
      }),
    ]);

    // Alusta stop-kohtaiset summaryt
    const perStop: Record<
      string,
      {
        stopId: string;
        perCategory: Record<BudgetCategory, { plan: number; actual: number; diff: number }>;
        totals: { plan: number; actual: number; diff: number };
      }
    > = {};

    for (const id of stopIds) {
      perStop[id] = {
        stopId: id,
        perCategory: {
          lodging: { plan: 0, actual: 0, diff: 0 },
          food: { plan: 0, actual: 0, diff: 0 },
          transport: { plan: 0, actual: 0, diff: 0 },
          activities: { plan: 0, actual: 0, diff: 0 },
          other: { plan: 0, actual: 0, diff: 0 },
        },
        totals: { plan: 0, actual: 0, diff: 0 },
      };
    }

    for (const p of plans) {
      const stop = perStop[p.stopId];
      if (!stop) continue;
      stop.perCategory[p.category as BudgetCategory].plan = p.amount;
    }

    for (const e of expenses) {
      const stop = perStop[e.stopId];
      if (!stop) continue;
      stop.perCategory[e.category as BudgetCategory].actual += e.amount;
    }

    // diff + totals per stop
    for (const stopId of stopIds) {
      const stop = perStop[stopId];

      for (const category of CATEGORIES) {
        const row = stop.perCategory[category];
        row.diff = row.plan - row.actual;
        stop.totals.plan += row.plan;
        stop.totals.actual += row.actual;
        stop.totals.diff += row.diff;
      }
    }

    const stops = stopIds.map((id) => perStop[id]);

    const totals = stops.reduce(
      (acc, s) => {
        acc.plan += s.totals.plan;
        acc.actual += s.totals.actual;
        acc.diff += s.totals.diff;
        return acc;
      },
      { plan: 0, actual: 0, diff: 0 }
    );

    return { stops, totals };
  }

  async getTripSummaryByTripId(tripId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId }, select: { id: true } });
    if (!trip) throw new NotFoundException(`Trip with id ${tripId} not found`);

    const stops = await this.prisma.stop.findMany({
        where: { tripId },
        select: { id: true },
    });

    return this.getTripSummary(stops.map(s => s.id));
}


  private async ensureStop(stopId: string) {
    const stop = await this.prisma.stop.findUnique({ where: { id: stopId }, select: { id: true } });
    if (!stop) throw new NotFoundException(`Stop with id ${stopId} not found`);
  }
}
