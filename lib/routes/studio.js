const { Router } = require('express');
const Studio = require('../models/Studio');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { name } = req.body;

    Studio
      .create({ name })
      .then(studio => res.send(studio))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Studio
      .find()
      .then(studios => res.send(studios))
      .catch(next);
  });
