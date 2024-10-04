import { addDays, addHours } from "date-fns";
import { Conference } from "../../conference/entities/conference.entity";
import { e2eUsers } from "./user-seeds";
import { ConferenceFixture } from "../fixtures/conference-fixture";

export const e2eConferences = {
    firstConference: new ConferenceFixture(
        new Conference({
            id: 'id-1',
            organizerId: e2eUsers.johnDoe.entity.props.id,
            title: 'My first conference',
            startDate: addDays(new Date(), 4),
            endDate: addDays(addHours(new Date(), 2), 4),
            seats: 100,
        })
    )
}