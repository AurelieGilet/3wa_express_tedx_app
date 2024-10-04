import { Booking } from '../../conference/entities/booking.entity';
import { BookingFixture } from '../fixtures/booking-fixture';
import { e2eConferences } from './conference-seeds';
import { e2eUsers } from './user-seeds';

export const e2eBookings = {
    bobBooking: new BookingFixture(
        new Booking({
            userId: e2eUsers.bob.entity.props.id,
            conferenceId: e2eConferences.firstConference.entity.props.id,
        })
    ),
    aliceBooking: new BookingFixture(
        new Booking({
            userId: e2eUsers.bob.entity.props.id,
            conferenceId: e2eConferences.firstConference.entity.props.id,
        })
    ),
};
