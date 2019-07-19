require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');
const Studio = require('../lib/models/Studio');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let actors = null;
  let studio = null;
  let film = null;
  beforeEach(async() => {
    actors = JSON.parse(JSON.stringify(await Actor.create([{ name: 'Ryan Gosling' }, { name: 'Brad Pitt' }])));
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'studio one',  })));
    film = JSON.parse(JSON.stringify(await Film.create({ 
      title: 'Fight Club', 
      studio: studio._id, 
      released: 1999, 
      cast: [{ role: 'main', actor: actors[0]._id }, { role: 'main', actor: actors[1]._id }]
    })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({ title: 'a movie', studio: studio._id, released: 1999,
        cast: [
          {
            role: 'main',
            actor: actors[0]._id
          },
          {
            role: 'main',
            actor: actors[1]._id
          }
        ]
      })
      .then((res => {
        // console.log(res.body);
        
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'a movie',
          studio: expect.any(String),
          released: 1999,
          cast: [{
            _id: expect.any(String),
            role: 'main',
            actor: actors[0]._id
          },
          { 
            _id: expect.any(String),
            role: 'main',
            actor: actors[1]._id
          }],
          __v: 0
        });
      }));
  });

  it('gets films', () => {
    return request(app)
      .get('/api/v1/films')
      .then(res => {
        // console.log(res.body); 
        // console.log(film);
        expect(res.body).toEqual([{ 
          _id: expect.any(String),
          title: 'Fight Club',
          released: 1999,
          studio: {
            _id: studio._id,
            name: studio.name
          }

        }]);
      });
  });


});
