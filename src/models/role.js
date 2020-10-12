const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  guildID: {
    type: String,
    required: true,
  },
  roles: {
    type: [
      {
        type: String,
        required: true,
      },
    ],
  },
});

module.exports = mongoose.model('Role', roleSchema, 'roles');
