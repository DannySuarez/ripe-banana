const { Router } = require('express');
const Actor = require('../models/Actor');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { name } = req.body;

    Actor
      .create({ name })
      .then(actors => res.send(actors))
      .catch(next);
  })

  .get('/', (req, res, next) => {

    Actor
      .find()
      .select({ _id: true, name: true })
      .then(actors => res.send(actors))
      .catch(next);
  });
