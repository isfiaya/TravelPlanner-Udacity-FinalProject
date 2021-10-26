const app = require('../src/server/server')
const supertest = require('supertest');
const request = supertest(app);

test('should return status 200 for GET method', async () => {
    await request.get("/key")
        .expect(200)

})