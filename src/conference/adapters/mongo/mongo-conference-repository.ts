import { Model } from 'mongoose';
import { Conference } from '../../entities/conference.entity';
import { IConferenceRepository } from '../../ports/conference-repository.interface';
import { MongoConference } from './mongo-conference';

class ConferenceMapper {
    toCore(model: MongoConference.ConferenceDocument): Conference {
        return new Conference({
            id: model._id,
            organizerId: model.organizerId,
            title: model.title,
            startDate: model.startDate,
            endDate: model.endDate,
            seats: model.seats,
        });
    }

    toPersistence(conference: Conference): MongoConference.ConferenceDocument {
        return new MongoConference.ConferenceModel({
            _id: conference.props.id,
            organizerId: conference.props.organizerId,
            title: conference.props.title,
            startDate: conference.props.startDate,
            endDate: conference.props.endDate,
            seats: conference.props.seats,
        });
    }
}

export class MongoConferenceRepository implements IConferenceRepository {
    private readonly mapper = new ConferenceMapper();

    constructor(private readonly model: Model<MongoConference.ConferenceDocument>) {}

    async findById(id: string): Promise<Conference | null> {
        const conference = await this.model.findOne({ _id: id });

        if (!conference) {
            return null;
        }

        return this.mapper.toCore(conference);
    }

    async create(conference: Conference): Promise<void> {
        const record = this.mapper.toPersistence(conference);

        await record.save();
    }

    async update(conference: Conference): Promise<void> {
        const updatedData = this.mapper.toPersistence(conference);

        await this.model.updateOne(
            { _id: conference.props.id },
            {
                $set: {
                    title: updatedData.title,
                    organizerId: updatedData.organizerId,
                    startDate: updatedData.startDate,
                    endDate: updatedData.endDate,
                    seats: updatedData.seats,
                },
            }
        );
    }
}
