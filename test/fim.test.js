require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');
const Studio = require('../lib/models/Studio');
const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');

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
  let reviewer = null;
  let review = null;
  beforeEach(async() => {
    actors = JSON.parse(JSON.stringify(await Actor.create([{ name: 'Ryan Gosling' }, { name: 'Brad Pitt' }])));
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'studio one',  })));
    film = JSON.parse(JSON.stringify(await Film.create({ 
      title: 'Fight Club', 
      studio: studio._id, 
      released: 1999, 
      cast: [{ role: 'main', actor: actors[0]._id }, { role: 'main', actor: actors[1]._id }]
    })));
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'danny', company: 'dannyllc' })));
    review = JSON.parse(JSON.stringify(await Review.create({ 
      rating: 1,
      reviewer: reviewer._id,
      review: 'meh',
      film: film._id
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

  it('can get film by ID', () => {
    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {
        console.log(res.body);
        
        expect(res.body).toEqual({
          _id: film._id,
          title: 'Fight Club',
          released: film.released,
          studio: {
            _id: studio._id,
            name: studio.name
          },
          cast: [{
            _id: expect.any(String),
            role: film.cast[0].role,
            actor: {
              _id: actors[0]._id,
              name: actors[0].name
            }
          },
          {
            _id: expect.any(String),
            role: film.cast[1].role,
            actor: {
              _id: actors[1]._id,
              name: actors[1].name
            }
          }],
          reviews: [{
            _id: review._id,
            rating: 1,
            review: 'meh',
            reviewer: {
              _id: reviewer._id,
              name: reviewer.name
            }
          }]
        });
      });
  });

});
