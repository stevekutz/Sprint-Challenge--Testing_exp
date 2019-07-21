const server = require('./server');

const request = require('supertest');

describe('server tests basic sanity check verification', () => {
    console.log('>>>>> Server TESTS started');

    it('should verify env variable reflects test environment', () => {
        expect(process.env.DB_ENV).toBe('testing');
    })

    it('should return sanoty check with 200 status', async () => {
        const expectedStatusCode = 200;
        const expectedBody = {message: `Sprint TESTING server sanity check !!! `};
    })

    it('should return JSON', async () => {
        const res = await request(server).get('/');
        expect(res.type).toBe('application/json');
    })

})