require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');

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
      .post('/api/v1/studios')
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
      .get('/api/v1/studios')
      .then(res => {
        const studiosJSON = JSON.parse(JSON.stringify(studios));        
        studiosJSON.forEach(studio => {
          expect(res.body).toContainEqual({ name: studio.name, _id: studio._id });
        });
      });
  });

  it('can get studio by an ID', async() => {
    const studios = await Studio.create([
      { name: 'test studio' },
      { name: 'test studio two' }
    ]);
    const actor = await Actor.create(
      { name: 'Jason Stathom' }
    );
    const film = await Film.create({
      title: 'The Transporter',
      studio: studios[0]._id,
      released: 2002,
      cast: [{
        role: 'Main',
        actor: actor._id
      }]
    });

    return request(app)
      .get(`/api/v1/studios/${studios[0]._id}`)
      .then((res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: studios[0].name,
          films: [{
            _id: film._id.toString(),
            title: film.title
          }]
        });
      }));
  });

});
