const mongoose = require('mongoose');

const joindateSchema = new mongoose.Schema({
  guildID: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Joindate', joindateSchema, 'joindates');
