const { Router } = require('express');
const Studio = require('../models/Studio');
const Film = require('../models/Film');

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
      .select({ _id: true, name: true })
      .then(studios => res.send(studios))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Studio.findById(req.params.id),
      Film.find({})
    ])
      .then(([ ]) => res.send({ ...}))
  })
