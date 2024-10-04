import { User } from "../entities/user.entity";

export const testUsers = {
    johnDoe: new User({
        id: 'john-doe',
        emailAddress: 'johndoe@mail.com',
        password: 'password',
    }),
    bob: new User({
        id: 'bob',
        emailAddress: 'bob@mail.com',
        password: 'password',
    }),
    alice: new User({
        id: 'alice',
        emailAddress: 'alice@mail.com',
        password: 'password',
    }),
}

// Generate 28 additional users for a total of 31
// 1 conference organizer + 30 bookings
for (let i = 1; i <= 28; i++) {
    const id = `user-${i}`;
    const email = `user${i}@mail.com`;
    
    testUsers[id] = new User({
        id: id,
        emailAddress: email,
        password: 'password',
    });
}