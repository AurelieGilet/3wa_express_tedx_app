import { Executable } from "../../core/executable.interface";
import { Booking } from "../entities/booking.entity";
import { IBookingRepository } from "../ports/booking-repository.interface";

type RequestBookConference = {
    userId: string;
    conferenceId: string;
};

type ResponseBookConference = void

export class BookConference implements Executable<RequestBookConference, ResponseBookConference> {
    constructor(
        private readonly repository: IBookingRepository,
    ){}

    async execute({userId, conferenceId}) {
        const newBooking = new Booking({
            userId,
            conferenceId,
        })

        await this.repository.create(newBooking);
    }
}