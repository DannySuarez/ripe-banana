require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a studio', () => {
    return request(app)
      .post('/api/v1/studio')
      .send({ name: 'studio one' })
      .then((res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'studio one',
          __v: 0
        });
      }));
  });

  it('can get studios', async() => {
    const studios = await Studio.create([
      { name: 'silly studio' },
      { name: 'studio one' },
      { name: 'another studio' }
    ]);

    return request(app)
      .get('/api/v1/studio')
      .then(res => {
        const studiosJSON = JSON.parse(JSON.stringify(studios));        
        studiosJSON.forEach(studio => {
          expect(res.body).toContainEqual(studio);
        });
      });
  });



});
