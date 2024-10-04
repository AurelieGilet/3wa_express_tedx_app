import { testUsers } from '../../user/tests/user-seeds';
import { InMemoryBookingRepository } from '../adapters/in-memory-booking-repository';
import { testConference } from '../tests/conference-seeds';
import { BookConference } from './book-conference';

describe('Feature: book a conference', () => {
    let bookingRepository: InMemoryBookingRepository;
    let useCase: BookConference;

    beforeEach(async () => {
        bookingRepository = new InMemoryBookingRepository();
        useCase = new BookConference(bookingRepository);
    });

    describe('Scenario: Happy path', () => {
        it('should book a seat in a conference', async () => {
            await useCase.execute({
                userId: testUsers.bob.props.id,
                conferenceId: testConference.conference1.props.id,
            });

            const fetchedBooking = await bookingRepository.findByConferenceId(testConference.conference1.props.id);

            expect(fetchedBooking[0].props.userId).toEqual(testUsers.bob.props.id);
        });
    });
});
