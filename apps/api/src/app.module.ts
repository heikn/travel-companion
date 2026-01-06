import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health.module';
import { TripsModule } from './modules/trips/trips.module';
import { StopsModule } from './modules/stops/stops.module';
import { BudgetModule } from './modules/budget/budget.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, HealthModule, TripsModule, StopsModule, BudgetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
