import { AwilixContainer } from 'awilix';
import { User } from '../../user/entities/user.entity';
import { IFixture } from './fixture.interface';
import { IUserRepository } from '../../user/ports/user-repository.interface';
import { e2eUsers } from '../seeds/user-seeds';

export class UserFixture implements IFixture {
    constructor(public entity: User) {}

    async load(container: AwilixContainer): Promise<void> {
        const repository = container.resolve('userRepository') as IUserRepository;

        await repository.create(this.entity);
    }

    createAuthorizationToken() {
        return (
            'Basic ' +
            Buffer.from(
                `${this.entity.props.emailAddress}:${e2eUsers.johnDoe.entity.props.password}`
            ).toString('base64')
        );
    }
}
