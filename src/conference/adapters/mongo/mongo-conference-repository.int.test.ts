import { Model } from 'mongoose';
import { TestApp } from '../../../tests/utils/test-app';
import { MongoConference } from './mongo-conference';
import { MongoConferenceRepository } from './mongo-conference-repository';
import { MongoUser } from '../../../user/adapters/mongo/mongo-user';
import { testUsers } from '../../../user/tests/user-seeds';
import { testConference } from '../../tests/conference-seeds';
import { Conference } from '../../entities/conference.entity';

describe('MongoBookingRepository', () => {
    let app: TestApp;
    let userModel: Model<MongoUser.UserDocument>;
    let conferenceModel: Model<MongoConference.ConferenceDocument>;
    let conferenceRepository: MongoConferenceRepository;

    beforeEach(async () => {
        app = new TestApp();
        await app.setup();

        userModel = MongoUser.UserModel;
        conferenceModel = MongoConference.ConferenceModel;

        await Promise.all([userModel.deleteMany({}), conferenceModel.deleteMany({})]);

        conferenceRepository = new MongoConferenceRepository(conferenceModel);

        const userRecord = new userModel({
            _id: testUsers.johnDoe.props.id,
            emailAddress: testUsers.johnDoe.props.emailAddress,
            password: testUsers.johnDoe.props.password,
        });
        await userRecord.save();

        const conferenceRecord = new conferenceModel({
            _id: testConference.conference1.props.id,
            organizerId: testConference.conference1.props.organizerId,
            title: testConference.conference1.props.title,
            startDate: testConference.conference1.props.startDate,
            endDate: testConference.conference1.props.endDate,
            seats: testConference.conference1.props.seats,
        });
        await conferenceRecord.save();
    });

    afterEach(async () => {
        await app.tearDown();
    });

    describe('Scenario: Create a conference', () => {
        it('should create a conference', async () => {
            await conferenceRepository.create(testConference.conference2);

            const fetchedConference = await conferenceModel.findOne({
                _id: testConference.conference2.props.id,
            });

            expect(fetchedConference?.toObject()).toEqual({
                _id: testConference.conference2.props.id,
                organizerId: testConference.conference2.props.organizerId,
                title: testConference.conference2.props.title,
                startDate: testConference.conference2.props.startDate,
                endDate: testConference.conference2.props.endDate,
                seats: testConference.conference2.props.seats,
                __v: 0,
            });
        });
    });

    describe('Scenario: findById', () => {
        it('should find a conference with its id', async () => {
            const conference = await conferenceRepository.findById(
                testConference.conference1.props.id
            );

            expect(conference?.props).toEqual(testConference.conference1.props);
        });

        it('should return null if conference not found', async () => {
            const conference = await conferenceRepository.findById('nonexisting-id');

            expect(conference).toBe(null);
        });
    });

    describe('Scenario: update conference', () => {
        it('should update the conference', async () => {
            const originalConference = await conferenceRepository.findById(testConference.conference1.props.id);

            const updatedConference = new Conference({
                ...originalConference!.props,
                seats: 100,
            });

            await conferenceRepository.update(updatedConference);

            const fetchedConference = await conferenceRepository.findById(testConference.conference1.props.id);

            expect(fetchedConference?.props.seats).toEqual(100);
        })
    })
});
