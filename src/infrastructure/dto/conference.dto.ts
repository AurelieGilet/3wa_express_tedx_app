import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateConferenceInputs {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: Date;

    @IsDateString()
    @IsNotEmpty()
    endDate: Date;

    @IsNumber()
    @IsNotEmpty()
    seats: number;
}

export class ChangeSeatsInputs {
    @IsNumber()
    @IsNotEmpty()
    seats: number;
}

export class ChangeDatesInputs {
    @IsDateString()
    @IsNotEmpty()
    startDate: Date;

    @IsDateString()
    @IsNotEmpty()
    endDate: Date;
}
