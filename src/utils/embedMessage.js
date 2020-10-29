const { MessageEmbed } = require('discord.js');

const embedMessage = (message) => {
  const { tag } = message.author;
  return new MessageEmbed()
    .setColor('#c43421')
    .setFooter(`Requested by ${tag}`, message.author.avatarURL())
    .setTimestamp();
};

module.exports = embedMessage;
