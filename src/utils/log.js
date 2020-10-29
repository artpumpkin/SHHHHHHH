const { MessageEmbed } = require('discord.js');

const log = async (client, message, channelID) => {
  const logsChannel = client.guilds.cache
    .get(process.env.SUPPORT_GUILD_ID)
    .channels.cache.get(channelID);

  const logEmbed = new MessageEmbed()
    .setColor('#1976d2')
    .setDescription(message)
    .setTimestamp();
  logsChannel.send(logEmbed);
};

module.exports = log;
