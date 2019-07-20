require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');

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

  it('can create a review', async() => {
    const studio = await Studio.create({ name: 'a studio that reviews' });
    const actor = await Actor.create({ name: 'lisa' });
    const film  = await Film.create({ title: 'a movie', studio: studio._id, released: 1999,
      cast: [
        {
          role: 'main',
          actor: actor._id
        },
        {
          role: 'main',
          actor: actor._id
        }
      ] });
    const reviewer = await Reviewer.create([
      { name: 'danny', company: 'danreviewsllc' }
    ]);

    return request(app)
      .post('/api/v1/reviews')
      .send({ 
        rating: 1,
        reviewer: reviewer[0]._id,
        review: 'not good',
        film: film._id
      })
      .then((res => {
        console.log(res.body);
        
        expect(res.body).toEqual({
          _id: expect.any(String),
          rating: 1,
          reviewer: reviewer[0]._id.toString(),
          review: 'not good',
          film: film._id.toString(),
          __v: 0
        });
      }));
  });

  it('can get 100 reviews', async() => {
    const studio = await Studio.create({ name: 'a studio that reviews' });
    const actor = await Actor.create({ name: 'lisa' });
    const film  = await Film.create({ title: 'a movie', studio: studio._id, released: 1999,
      cast: [
        {
          role: 'main',
          actor: actor._id
        },
        {
          role: 'main',
          actor: actor._id
        }
      ] });
    const reviewer = await Reviewer.create(
      { name: 'danny', company: 'danreviewsllc' }
    );
    
    await Promise.all([...Array(101)].map(() => {
      return Review.create({
        rating: 1,
        reviewer: reviewer._id,
        review: 'not good',
        film: film._id
      });
    }));

    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body).toHaveLength(100);
      });

  });

});
