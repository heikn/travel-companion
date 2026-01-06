import { Get, Param, Post, Body, Patch, Delete, Controller } from "@nestjs/common";
import { StopsService } from "./stops.service";
import { CreateStopDto } from "./dto/create-stop.dto";
import { UpdateStopDto } from "./dto/update-stop.dto";

@Controller()
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Get("trips/:tripId/stops")
  getStopsForTrip(@Param("tripId") tripId: string) {
    return this.stopsService.findByTripId(tripId);
  }

  @Post("trips/:tripId/stops")
  createStop(@Param("tripId") tripId: string, @Body() dto: CreateStopDto) {
    return this.stopsService.create(tripId, dto);
  }

  @Patch("stops/:stopId")
  updateStop(@Param("stopId") stopId: string, @Body() dto: UpdateStopDto) {
    return this.stopsService.update(stopId, dto);
  }

  @Delete("stops/:stopId")
  async deleteStop(@Param("stopId") stopId: string) {
    await this.stopsService.remove(stopId);
    return { message: `Stop with id ${stopId} deleted successfully` };
  }
}
