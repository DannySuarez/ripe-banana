require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

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

  it('can create an actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({ name: 'Ruby Rose' })
      .then((res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Ruby Rose',
          __v: 0
        });
      }));
  });

  it('can get actors', async() => {
    const actors = await Actor.create([
      { name: 'sylvester stallone' },
      { name: 'antonio banderas' },
      { name: 'reese witherspoon' }
    ]);

    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        const actorsJSON = JSON.parse(JSON.stringify(actors));        
        actorsJSON.forEach(actor => {
          expect(res.body).toContainEqual({ name: actor.name, _id: actor._id });
        });
      });
  });


});
