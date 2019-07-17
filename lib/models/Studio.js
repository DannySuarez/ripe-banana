const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    city: String,
    state: String,
    country: String
  }
});

module.exports = mongoose.model('Studio', studioSchema);
