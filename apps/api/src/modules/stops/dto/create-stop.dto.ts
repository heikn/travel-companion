import { IsInt, IsOptional, IsString, Matches, MaxLength, Min } from "class-validator";

const YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;

export class CreateStopDto {
    @IsInt()
    @Min(1)
    order!: number;

    @IsString()
    @MaxLength(80)
    cityName!: string;

    @IsOptional()
    @Matches(YYYY_MM_DD, { message: "startDate must be in YYYY-MM-DD format" })
    startDate?: string;

    @IsOptional()
    @Matches(YYYY_MM_DD, { message: "endDate must be in YYYY-MM-DD format" })
    endDate?: string;
    
    @IsOptional()
    @IsString()
    @MaxLength(500)
    notes?: string;
}