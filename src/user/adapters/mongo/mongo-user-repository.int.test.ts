import { Model } from 'mongoose';
import { TestApp } from '../../../tests/utils/test-app';
import { MongoUser } from './mongo-user';
import { MongoUserRepository } from './mongo-user-repository';
import { testUsers } from '../../tests/user-seeds';

describe('MongoUserRepository', () => {
    let app: TestApp;
    let model: Model<MongoUser.UserDocument>;
    let repository: MongoUserRepository;

    beforeEach(async () => {
        app = new TestApp();
        await app.setup();

        model = MongoUser.UserModel;
        await model.deleteMany({});
        repository = new MongoUserRepository(model);

        const record = new model({
            _id: testUsers.johnDoe.props.id,
            emailAddress: testUsers.johnDoe.props.emailAddress,
            password: testUsers.johnDoe.props.password,
        });

        await record.save();
    });

    afterEach(async () => {
        await app.tearDown();
    });

    describe('Scenario: Create a user', () => {
        it('should create a user', async () => {
            await repository.create(testUsers.bob);

            const fetchedUser = await model.findOne({ _id: testUsers.bob.props.id });

            expect(fetchedUser?.toObject()).toEqual({
                _id: testUsers.bob.props.id,
                emailAddress: testUsers.bob.props.emailAddress,
                password: testUsers.bob.props.password,
                __v: 0,
            });
        });
    });

    describe('Scenario: findByEmailAddress', () => {
        it('should find a user with its email address', async () => {
            const user = await repository.findByEmailAddress(testUsers.johnDoe.props.emailAddress);

            expect(user?.props).toEqual(testUsers.johnDoe.props);
        });

        it('should return null if user not found', async () => {
            const user = await repository.findByEmailAddress('nonexisting@mail.com');

            expect(user).toBe(null);
        });
    });

    describe('Scenario: findById', () => {
        it('should find a user with its id', async () => {
            const user = await repository.findById(testUsers.johnDoe.props.id);

            expect(user?.props).toEqual(testUsers.johnDoe.props);
        });

        it('should return null if user not found', async () => {
            const user = await repository.findById('nonexisting-id');

            expect(user).toBe(null);
        });
    });

    
});
