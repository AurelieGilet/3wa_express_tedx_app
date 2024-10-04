import { User } from '../../user/entities/user.entity';
import { UserFixture } from '../fixtures/user-fixture';

export const e2eUsers = {
    johnDoe: new UserFixture(
        new User({
            id: 'john-doe',
            emailAddress: 'johndoe@mail.com',
            password: 'password',
        })
    ),
    bob: new UserFixture(
        new User({
            id: 'bob',
            emailAddress: 'bob@mail.com',
            password: 'password',
        })
    ),
    alice: new UserFixture(
        new User({
            id: 'alice',
            emailAddress: 'alice@mail.com',
            password: 'password',
        })
    ),
};
