const mongoose = require('mongoose');

const grantSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  commands: [{
    type: String,
    require: true,
  }],
});

module.exports = mongoose.model('Grant', grantSchema, 'grants');
