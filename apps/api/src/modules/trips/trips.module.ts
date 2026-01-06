import { Module } from "@nestjs/common";
import { TripsController } from "./trips.controller";
import { TripsService } from "./trips.service";
import { StopsModule } from "../stops/stops.module";

@Module({
    imports: [StopsModule],
    controllers: [TripsController],
    providers: [TripsService],
})
export class TripsModule {}