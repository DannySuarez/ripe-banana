require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');

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

  it('can create a reviewer', () => {
    return request(app)
      .post('/api/v1/reviewer')
      .send({ name: 'Danny', company: 'Self' })
      .then((res => {        
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Danny',
          company: 'Self',
          __v: 0
        });
      }));
  });

  it('can get a reviewer', async() => {
    const reviewers = await Reviewer.create([
      { name: 'danny', company: 'self' },
      { name: 'george', company: 'reviewsllc' },
      { name: 'John', company: 'rotten tomatoes' }
    ]);
    
    return request(app)
      .get('/api/v1/reviewer')
      .then(res => {
        const reviewerJSON = JSON.parse(JSON.stringify(reviewers));
        reviewerJSON.forEach(reviewer => {
          expect(res.body).toContainEqual({ _id: reviewer._id, name: reviewer.name, company: reviewer.company });
        });
      });
  });

  it('can get reviewer by ID', async() => {
    const studio = await Studio.create({ name: 'studio one' });
    const actor = await Actor.create({ name: 'Jason' });
    const film = JSON.parse(JSON.stringify(await Film.create({
      title: 'Jason X',
      studio: studio._id,
      released: 2004,
      cast: [{
        role: 'killer',
        actor: actor._id
      }]
    })));
    const reviewer = await Reviewer.create({ 
      name: 'danny', company: 'dannyllc' 
    });
    const review = await Review.create({
      rating: 1,
      reviewer: reviewer._id,
      review: 'i want my money back',
      film: film._id,
    });

    return request(app)
      .get(`/api/v1/reviewer/${reviewer._id}`)
      .then(res => {        
        expect(res.body).toEqual({
          _id: reviewer._id.toString(),
          name: 'danny',
          company: 'dannyllc',
          reviews: [{
            _id: review._id.toString(),
            rating: 1,
            review: 'i want my money back',
            film: {
              _id: film._id.toString(),
              title: 'Jason X'
            }
          }]
        });
      });

  });
});
