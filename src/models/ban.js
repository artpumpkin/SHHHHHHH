const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Ban', banSchema, 'bans');
