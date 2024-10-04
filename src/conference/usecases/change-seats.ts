import { Executable } from '../../core/executable.interface';
import { User } from '../../user/entities/user.entity';
import { ConferenceNotFoundException } from '../exceptions/conference-not-found';
import { ConferenceUpdateForbiddenException } from '../exceptions/conference-update-forbidden';
import { IBookingRepository } from '../ports/booking-repository.interface';
import { IConferenceRepository } from '../ports/conference-repository.interface';

type RequestChangeSeats = {
    user: User;
    conferenceId: string;
    seats: number;
};

type ResponseChangeSeats = void;

export class ChangeSeats implements Executable<RequestChangeSeats, ResponseChangeSeats> {
    constructor(
        private readonly repository: IConferenceRepository,
        private readonly bookingRepository: IBookingRepository
    ) {}

    async execute({ user, conferenceId, seats }) {
        const conference = await this.repository.findById(conferenceId);

        if (!conference) {
            throw new ConferenceNotFoundException();
        }

        if (conference.props.organizerId !== user.props.id) {
            throw new ConferenceUpdateForbiddenException();
        }

        conference.update({ seats });

        if (conference.hasNotEnoughSeats() || conference.hasTooManySeats()) {
            throw new Error(
                'The conference must have a minimum of 20 seats and a maximum of 1000 seats'
            );
        }

        // Fetch the number of existing bookings for the conference
        const numberOfBookings = await this.bookingRepository.countBookingsForConference(
            conferenceId
        );

        // Check if the new seat count is less than the number of bookings
        if (seats < numberOfBookings) {
            throw new Error('The conference cannot have less seats than bookings');
        }

        await this.repository.update(conference);
    }
}
