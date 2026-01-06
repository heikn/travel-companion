import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import type { Prisma } from "@prisma/client";

export interface Stop {
  id: string;
  tripId: string;
  order: number;
  cityName: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

@Injectable()
export class StopsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTripId(tripId: string): Promise<Stop[]> {
    // Jos haluat 404 kun tripId on väärä, tarkista trip erikseen.
    return this.prisma.stop.findMany({
      where: { tripId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        tripId: true,
        order: true,
        cityName: true,
        startDate: true,
        endDate: true,
        notes: true,
      },
    }).then(rows => rows.map(this.mapStop));
  }

  async create(tripId: string, input: Omit<Stop, "id" | "tripId">): Promise<Stop> {
    // Varmistetaan että trip on olemassa (muuten FK error)
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId }, select: { id: true } });
    if (!trip) throw new NotFoundException(`Trip with id ${tripId} not found`);

    try {
      const row = await this.prisma.stop.create({
        data: {
          tripId,
          order: input.order,
          cityName: input.cityName,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          notes: input.notes ?? undefined,
        },
        select: {
          id: true,
          tripId: true,
          order: true,
          cityName: true,
          startDate: true,
          endDate: true,
          notes: true,
        },
      });

      return this.mapStop(row);
    } catch (e: any) {
      // (tripId, order) unique -> Conflict
      if (e?.code === "P2002") {
        throw new ConflictException(`Stop order ${input.order} already exists for trip ${tripId}`);
      }
      throw e;
    }
  }

  async update(stopId: string, patch: Partial<Omit<Stop, "id" | "tripId">>): Promise<Stop> {
    try {
      const row = await this.prisma.stop.update({
        where: { id: stopId },
        data: {
          order: patch.order ?? undefined,
          cityName: patch.cityName ?? undefined,
          startDate: patch.startDate ? new Date(patch.startDate) : undefined,
          endDate: patch.endDate ? new Date(patch.endDate) : undefined,
          notes: patch.notes ?? undefined,
        },
        select: {
          id: true,
          tripId: true,
          order: true,
          cityName: true,
          startDate: true,
          endDate: true,
          notes: true,
        },
      });

      return this.mapStop(row);
    } catch (e: any) {
      if (e?.code === "P2025") {
        throw new NotFoundException(`Stop with id ${stopId} not found`);
      }
      if (e?.code === "P2002") {
        throw new ConflictException(`Stop order already exists for this trip`);
      }
      throw e;
    }
  }

  async remove(stopId: string): Promise<void> {
    try {
      await this.prisma.stop.delete({ where: { id: stopId } });
    } catch (e: any) {
      if (e?.code === "P2025") {
        throw new NotFoundException(`Stop with id ${stopId} not found`);
      }
      throw e;
    }
  }

  private mapStop(row: {
    id: string;
    tripId: string;
    order: number;
    cityName: string;
    startDate: Date | null;
    endDate: Date | null;
    notes: string | null;
  }): Stop {
    return {
      id: row.id,
      tripId: row.tripId,
      order: row.order,
      cityName: row.cityName,
      startDate: row.startDate?.toISOString(),
      endDate: row.endDate?.toISOString(),
      notes: row.notes ?? undefined,
    };
  }
}
