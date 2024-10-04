import { FixedDateGenerator } from '../../core/adapters/fixed-date-generator';
import { FixedIdGenerator } from '../../core/adapters/fixed-id-generator';
import { Conference } from '../entities/conference.entity';
import { User } from '../../user/entities/user.entity';
import { OrganizeConference } from './organize-conference';
import { InMemoryConferenceRepository } from '../adapters/in-memory-conference-repository';

describe('Feature: organize conference', () => {
    function expectConferenceToEqual(conference: Conference) {
        expect(conference.props).toEqual({
            id: 'id-1',
            organizerId: 'john-doe',
            title: 'My first conference',
            startDate: new Date('2024-09-01T10:00:00.00Z'),
            endDate: new Date('2024-09-01T11:00:00.00Z'),
            seats: 100,
        });
    }

    const johnDoe = new User({
        id: 'john-doe',
        emailAddress: 'johndoe@mail.com',
        password: 'password'
    });

    let repository: InMemoryConferenceRepository;
    let idGenerator: FixedIdGenerator;
    let dateGenerator: FixedDateGenerator;
    let useCase: OrganizeConference;

    // Lancé avant chaque test pour qu'ils aient une nouvelle base de données
    beforeEach(() => {
        repository = new InMemoryConferenceRepository();
        idGenerator = new FixedIdGenerator();
        dateGenerator = new FixedDateGenerator();
        useCase = new OrganizeConference(repository, idGenerator, dateGenerator);
    });

    describe('Scenario: Happy path', () => {
        const payload = {
            user: johnDoe,
            title: 'My first conference',
            startDate: new Date('2024-09-01T10:00:00.00Z'),
            endDate: new Date('2024-09-01T11:00:00.00Z'),
            seats: 100,
        };

        it('should create a conference', async () => {
            const result = await useCase.execute(payload);

            expect(result.id).toEqual('id-1');
        });

        it('should insert the conference into the database', async () => {
            await useCase.execute(payload);

            const createdConference = repository.database[0];

            expect(repository.database.length).toBe(1);
            expectConferenceToEqual(createdConference);
        });
    });

    describe('Scenario: The conference happens too soon', () => {
        const payload = {
            user: johnDoe,
            title: 'My first conference',
            startDate: new Date('2024-01-02T10:00:00.00Z'),
            endDate: new Date('2024-09-02T11:00:00.00Z'),
            seats: 100,
        };

        it('should throw an error', async () => {
            await expect(() => useCase.execute(payload)).rejects.toThrow(
                'The conference must take place in at least 3 days'
            );
        });

        it('should not create a conference', async () => {
            try {
                await expect(() => useCase.execute(payload)).rejects.toThrow();
            } catch (error) {}

            expect(repository.database.length).toBe(0);
        });
    });

    describe('Scenario: The conference has too many seats', () => {
        const payload = {
            user: johnDoe,
            title: 'My first conference',
            startDate: new Date('2024-01-10T10:00:00.00Z'),
            endDate: new Date('2024-09-10T11:00:00.00Z'),
            seats: 1001,
        };

        it('should throw an error', async () => {
            await expect(() => useCase.execute(payload)).rejects.toThrow(
                "The conference can't have more that 1000 participants"
            );
        });

        it('should not create a conference', async () => {
            try {
                await expect(() => useCase.execute(payload)).rejects.toThrow();
            } catch (error) {}

            expect(repository.database.length).toBe(0);
        });
    });

    describe('Scenario: The conference don\'t have enough seats', () => {
        const payload = {
            user: johnDoe,
            title: 'My first conference',
            startDate: new Date('2024-01-10T10:00:00.00Z'),
            endDate: new Date('2024-09-10T11:00:00.00Z'),
            seats: 15,
        };

        it('should throw an error', async () => {
            await expect(() => useCase.execute(payload)).rejects.toThrow(
                "The conference must have at least 20 participants"
            );
        });

        it('should not create a conference', async () => {
            try {
                await expect(() => useCase.execute(payload)).rejects.toThrow();
            } catch (error) {}

            expect(repository.database.length).toBe(0);
        });
    });

    describe('Scenario: The conference is too long', () => {
        const payload = {
            user: johnDoe,
            title: 'My first conference',
            startDate: new Date('2024-01-10T10:00:00.00Z'),
            endDate: new Date('2024-09-10T14:00:00.00Z'),
            seats: 50,
        };

        it('should throw an error', async () => {
            await expect(() => useCase.execute(payload)).rejects.toThrow(
                "The conference is too long (> 3 hours)"
            );
        });

        it('should not create a conference', async () => {
            try {
                await expect(() => useCase.execute(payload)).rejects.toThrow();
            } catch (error) {}

            expect(repository.database.length).toBe(0);
        });
    });
});
