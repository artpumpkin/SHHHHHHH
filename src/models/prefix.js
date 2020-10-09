const mongoose = require('mongoose');

const prefixSchema = new mongoose.Schema({
  guildID: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Prefix', prefixSchema, 'prefixes');
