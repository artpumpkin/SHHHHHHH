const ActivityTypes = require('discord.js').Constants;
const { DEFAULT_PREFIX } = require('../utils/constants');

const onReady = (client) => {
  console.log("client's ready!");
  client.user.setActivity(`${DEFAULT_PREFIX}help`, {
    type: ActivityTypes[0],
  });
};

module.exports = onReady;
