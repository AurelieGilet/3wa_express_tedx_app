import request from 'supertest';
import { e2eUsers } from './seeds/user-seeds';
import { TestApp } from './utils/test-app';
import { Application } from 'express';
import container from '../infrastructure/express_api/config/dependency-injection';
import { IConferenceRepository } from '../conference/ports/conference-repository.interface';
import { e2eConferences } from './seeds/conference-seeds';

describe('Feature: Change number of seats', () => {
    let testApp: TestApp;
    let app: Application;

    beforeEach(async () => {
        testApp = new TestApp();
        await testApp.setup();
        await testApp.loadAllFixtures([e2eUsers.johnDoe, e2eConferences.firstConference]);

        app = testApp.expressApp;
    });

    afterAll(async () => {
        await testApp.tearDown();
    });

    describe('Scenario: Happy path', () => {
        it('should modify the number of seats', async () => {
            const id = 'id-1';
            const seats = 150;
    
            const result = await request(app)
                .patch(`/conference/seats/${id}`)
                .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
                .send({
                    seats,
                });
    
            expect(result.status).toBe(200);
    
            const conferenceRepository = container.resolve(
                'conferenceRepository'
            ) as IConferenceRepository;
            const fetchedConference = await conferenceRepository.findById(id);
    
            expect(fetchedConference).toBeDefined();
            expect(fetchedConference?.props.seats).toEqual(seats);
        });
    });

    describe('Scenario: User is not authorized', () => {
        it('should return 403 unauthorized', async () => {
            const id = 'id-1';
            const seats = 150;
    
            const result = await request(app)
                .patch(`/conference/seats/${id}`)
                .send({
                    seats,
                });
    
            expect(result.status).toBe(403);
        })
    })
});
