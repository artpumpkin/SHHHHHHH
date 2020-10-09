const path = require('path');
const SHHHHHHH = require('./client/SHHHHHHH');

require('dotenv').config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
});
require('./db/mongoose');

const client = new SHHHHHHH();

client.login(process.env.DISCORD_BOT_TOKEN);
