import { testUsers } from '../../user/tests/user-seeds';
import { Booking } from '../entities/booking.entity';
import { testConference } from './conference-seeds';

export const testBooking = {
    bobBooking: new Booking({
        userId: testUsers.bob.props.id,
        conferenceId: testConference.conference1.props.id,
    }),
    aliceBooking: new Booking({
        userId: testUsers.alice.props.id,
        conferenceId: testConference.conference1.props.id,
    }),
};

// Generate bookings for the additional 28 users for a total of 30 bookings
for (let i = 1; i <= 28; i++) {
    const userId = testUsers[`user-${i}`].props.id;
    
    testBooking[`user${i}Booking`] = new Booking({
        userId: userId,
        conferenceId: testConference.conference1.props.id,
    });
}