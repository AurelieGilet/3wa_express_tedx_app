import { Conference } from '../entities/conference.entity';

export interface IConferenceRepository {
    create(conference: Conference): Promise<void>;

    update(conference: Conference): Promise<void>;

    findById(id: string): Promise<Conference | null>;
}
