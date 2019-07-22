const { Router } = require('express');
const Actor = require('../models/Actor');
const Film = require('../models/Film');

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
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Actor.findById(req.params.id)
        .select({ __v: false, _id: false }),
      Film.find({ 'cast.actor': req.params.id })
        .select({ _id: true, title: true, released: true })
    ])
      .then(([studio, films]) => res.send({ ...studio.toJSON(), films: [...films] }))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    Actor
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedActor => res.send(updatedActor))
      .catch(next);
  });

