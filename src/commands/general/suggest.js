const { MessageEmbed } = require('discord.js');
const { embedMessage } = require('../../utils/helpers');

module.exports = {
  name: 'suggest',
  aliases: ['s', 'suggestion'],
  cooldown: 3,
  usage: 'suggest [suggestion(s)]',
  examples: [
    'suggest please add a mute command to mute people from voice channel',
  ],
  description: 'Send suggestions to the developer.',
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    if (args.length === 0) {
      messageEmbed.setDescription(
        `> Please make a suggestion e.g. \`${prefix}suggest [suggestion(s)]\`.\n⠀`,
      );
    } else {
      const channel = message.client.guilds.cache
        .get(process.env.SUPPORT_GUILD_ID)
        .channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID);

      const suggestionEmbed = new MessageEmbed()
        .setColor('#388e3c')
        .setAuthor(
          `${message.member.nickname} suggests : `,
          message.author.avatarURL(),
        )
        .setDescription(`> ${args.join` `}\n⠀`)
        .addField('👤 User', `<@${message.author.id}>`, true)
        .addField('🆔 User ID', `\`${message.author.id}\``, true)
        .addField('🏠 Guild', `\`${message.guild.name}\``, true)
        .addField('🆔 Guild ID', `\`${message.guild.id}\`\n⠀`, true)
        .setTimestamp();
      channel.send(suggestionEmbed);

      messageEmbed.setDescription('> Thanks for the suggestion.\n⠀');
    }
    return message.channel.send(messageEmbed);
  },
};
