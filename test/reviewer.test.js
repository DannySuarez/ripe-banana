require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
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

  it('can create a review', () => {
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
      { name: 'george', company: 'reviewsllc' }
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
});
