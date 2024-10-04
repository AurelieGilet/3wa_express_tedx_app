import { AwilixContainer } from 'awilix';
import { Conference } from '../../conference/entities/conference.entity';
import { IConferenceRepository } from '../../conference/ports/conference-repository.interface';
import { IFixture } from './fixture.interface';

export class ConferenceFixture implements IFixture {
    constructor(public entity: Conference) {}

    async load(container: AwilixContainer): Promise<void> {
        const repository = container.resolve('conferenceRepository') as IConferenceRepository;

        await repository.create(this.entity);
    }
}
