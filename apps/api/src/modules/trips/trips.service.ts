import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { CreateTripDto } from "@tc/shared";


export interface Trip {
    id: string;
    name: string;
}

@Injectable()
export class TripsService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.trip.findMany({
        include: { stops: { orderBy: { order: "asc" } } },
        orderBy: { createdAt: "desc" },
        });
    }

    async findById(id: string) {
        const trip = await this.prisma.trip.findUnique({
        where: { id },
        include: { stops: { orderBy: { order: "asc" } } },
        });
        if (!trip) throw new NotFoundException("Trip not found");
        return trip;
    }

    async create(dto: CreateTripDto) {
    return this.prisma.trip.create({
      data: { name: dto.name },
    });
  }
}