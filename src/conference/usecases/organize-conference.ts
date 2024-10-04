import { differenceInDays } from 'date-fns';
import { Conference } from '../entities/conference.entity';
import { IDateGenerator } from '../../core/ports/date-generator.interface';
import { IIdGenerator } from '../../core/ports/id-generator.interface';
import { User } from '../../user/entities/user.entity';
import { IConferenceRepository } from '../ports/conference-repository.interface';
import { Executable } from '../../core/executable.interface';
import { DomainException } from '../../core/exceptions/domain-exception';

type RequestOrganize = {
    user: User;
    title: string;
    startDate: Date;
    endDate: Date;
    seats: number;
};

type ResponseOrganize = {
    id: string;
};

export class OrganizeConference implements Executable<RequestOrganize, ResponseOrganize> {
    constructor(
        private readonly repository: IConferenceRepository,
        private readonly idGenerator: IIdGenerator, // FixedIdGenerator => id-1
        private readonly dateGenerator: IDateGenerator
    ) {}

    async execute({ title, startDate, endDate, seats, user }) {
        const id = this.idGenerator.generate();

        const newConference = new Conference({
            id,
            organizerId: user.props.id,
            title,
            startDate,
            endDate,
            seats,
        });

        if (newConference.isTooSoon(this.dateGenerator.now())) {
            throw new DomainException('The conference must take place in at least 3 days');
        }

        if (newConference.hasTooManySeats()) {
            throw new DomainException("The conference can't have more that 1000 participants");
        }

        if (newConference.hasNotEnoughSeats()) {
            throw new DomainException('The conference must have at least 20 participants');
        }

        if (newConference.isTooLong()) {
            throw new DomainException('The conference is too long (> 3 hours)');
        }

        await this.repository.create(newConference);

        return { id };
    }
}
