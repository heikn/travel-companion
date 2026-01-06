import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { TripsService } from "./trips.service";
import { StopsService } from "../stops/stops.service";
import { CreateTripDto } from "./dto/create-trip.dto";

@Controller("trips")
export class TripsController {
    constructor(private readonly tripsService: TripsService) {}

    @Get()
    findAll() {
        return this.tripsService.findAll();
    }

    @Get(":id")
    findById(@Param("id") id: string) {
        return this.tripsService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateTripDto) {
        return this.tripsService.create(dto);
    }
}