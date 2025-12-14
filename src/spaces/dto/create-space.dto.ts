import { IsOptional } from "class-validator";

export class CreateSpaceDto {
    name: string;
    type: string;
    capacity: number;
    description: string;
    @IsOptional()
    imageUrl?: string;
}
