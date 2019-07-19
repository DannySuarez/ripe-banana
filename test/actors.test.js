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

  it('can get actos by Id', async() => {
    const studios = await Studio.create([
      { name: 'test studio' },
      { name: 'test studio two' }
    ]);
    const actors = await Actor.create([
      { name: 'sylvester stallone', dob: new Date(1967, 7, 26), pob: 'england' },
      { name: 'antonio banderas', dob: new Date(1960, 7, 10), pob: 'somewhere' },
      { name: 'reese witherspoon', dob: new Date(1976, 3, 22), pob: 'somewhere' }
    ]);
    const films = await Film.create([{
      title: 'Rocky',
      studio: studios[0]._id,
      released: 2002,
      cast: [{
        role: 'Main',
        actor: actors[0]._id
      }]
    },
    {
      title: 'Zoro',
      studio: studios[1]._id,
      released: 2000,
      cast: [{
        role: 'Main',
        actor: actors[1]._id
      }]
    }
    ]);

    return request(app)
      .get(`/api/v1/actors/${actors[0]._id}`)
      .then((res => {        
        expect(res.body).toEqual({
          name: 'sylvester stallone',
          dob: actors[0].dob.toISOString(),
          pob: 'england',
          films: [{
            _id: films[0]._id.toString(),
            title: 'Rocky',
            released: 2002,
          }]
        });
      }));
  });

});
