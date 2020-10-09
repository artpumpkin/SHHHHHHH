const { Permissions, MessageEmbed } = require('discord.js');
const { DEFAULT_PREFIX } = require('../utils/constants');
const Joindate = require('../models/joindate');
const { log } = require('../utils/helpers');

const onGuildCreate = async (client, guild) => {
  const channel = guild.systemChannel
    || guild.channels.cache.find((c) => c.type === 'text' && c.position === 0);
  if (channel) {
    const canSendWelcomeMessage = channel
      .permissionsFor(guild.me)
      .has(Permissions.FLAGS.SEND_MESSAGES);
    if (canSendWelcomeMessage) {
      const messageEmbed = new MessageEmbed()
        .setColor('#c43421')
        .setDescription(
          `Welcome to ${client.user.username} A bot created especially to shush people while playing Among Us! Use **\`${DEFAULT_PREFIX}help\`** to get started!`,
        )
        .setThumbnail('https://i.imgur.com/dE9tW1o.png')
        .setFooter(`KEEP CALM AND ${client.user.username}`);
      channel.send(messageEmbed);
    }
  }

  const joindate = new Joindate({
    guildID: guild.id,
  });
  await joindate.save();
  log(`🔗 Joined \`${guild.name}\` (${guild.id}) with ${guild.memberCount} members.`);
};

module.exports = onGuildCreate;
