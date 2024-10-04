import { ChangeSeats } from './change-seats';
import { InMemoryConferenceRepository } from '../adapters/in-memory-conference-repository';
import { testConference } from '../tests/conference-seeds';
import { testUsers } from '../../user/tests/user-seeds';
import { InMemoryBookingRepository } from '../adapters/in-memory-booking-repository';
import { testBooking } from '../tests/booking-seeds';

describe('Feature: Change the number of seats', () => {
    async function expectSeatsUnchanged() {
        const fetchedConference = await repository.findById(testConference.conference1.props.id);

        expect(fetchedConference?.props.seats).toEqual(50);
    }

    let repository: InMemoryConferenceRepository;
    let bookingRepository: InMemoryBookingRepository;
    let useCase: ChangeSeats;

    beforeEach(async () => {
        repository = new InMemoryConferenceRepository();
        await repository.create(testConference.conference1);

        bookingRepository = new InMemoryBookingRepository();

        // Create static bookings for Bob and Alice
        await bookingRepository.create(testBooking.bobBooking);
        await bookingRepository.create(testBooking.aliceBooking);

        // Create bookings for the 28 other users
        for (let i = 1; i <= 28; i++) {
            const bookingKey = `user${i}Booking`;

            if (testBooking[bookingKey]) {
                await bookingRepository.create(testBooking[bookingKey]);
            }
        }
        useCase = new ChangeSeats(repository, bookingRepository);
    });

    describe('Scenario: Happy path', () => {
        it('should change the number of seats', async () => {
            await useCase.execute({
                user: testUsers.johnDoe,
                conferenceId: 'id-1',
                seats: 100,
            });

            const fetchedConference = await repository.findById(
                testConference.conference1.props.id
            );

            expect(fetchedConference!.props.seats).toEqual(100);
        });
    });

    describe('Scenario: Conference does not exist', () => {
        it('should fail', async () => {
            await expect(
                useCase.execute({
                    user: testUsers.johnDoe,
                    conferenceId: 'non-existing-id',
                    seats: 100,
                })
            ).rejects.toThrow('Conference not found');

            await expectSeatsUnchanged();
        });
    });

    describe("Scenario: Update someone else's conference", () => {
        it('should fail', async () => {
            await expect(
                useCase.execute({
                    user: testUsers.bob,
                    conferenceId: testConference.conference1.props.id,
                    seats: 100,
                })
            ).rejects.toThrow('You are not allowed to update this conference');

            await expectSeatsUnchanged();
        });
    });

    describe('Scenario: Number of seats >= 1000', () => {
        it('should fail', async () => {
            await expect(
                useCase.execute({
                    user: testUsers.johnDoe,
                    conferenceId: testConference.conference1.props.id,
                    seats: 1001,
                })
            ).rejects.toThrow(
                'The conference must have a minimum of 20 seats and a maximum of 1000 seats'
            );

            await expectSeatsUnchanged();
        });
    });

    describe('Scenario: Number of seats <= 20', () => {
        it('should fail', async () => {
            await expect(
                useCase.execute({
                    user: testUsers.johnDoe,
                    conferenceId: testConference.conference1.props.id,
                    seats: 15,
                })
            ).rejects.toThrow(
                'The conference must have a minimum of 20 seats and a maximum of 1000 seats'
            );

            await expectSeatsUnchanged();
        });
    });

    describe('Scenario: Number of seats > number of bookings', () => {
        it('should fail', async () => {
            await expect(
                useCase.execute({
                    user: testUsers.johnDoe,
                    conferenceId: testConference.conference1.props.id,
                    seats: 25, //For 30 Bookings
                })
            ).rejects.toThrow('The conference cannot have less seats than bookings');

            await expectSeatsUnchanged();
        });
    });
});
