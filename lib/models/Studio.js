const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  adress: {
    city: String,
    state: String,
    country: String
  }
});

module.exports - mongoose.model('Studio', studioSchema);
