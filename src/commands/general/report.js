const { MessageEmbed } = require('discord.js');
const { embedMessage } = require('../../utils/helpers');

module.exports = {
  name: 'report',
  aliases: ['r', 'report'],
  cooldown: 3,
  usage: 'report [bug or issue]',
  examples: ["report when I use the mute command it doesn't work"],
  description: 'Send a report to the developer.',
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    if (args.length === 0) {
      messageEmbed.setDescription(
        `> Please write the bug or the issue e.g. \`${prefix}report [bug or issue]\`.\n⠀`,
      );
    } else {
      const channel = message.client.guilds.cache
        .get(process.env.SUPPORT_GUILD_ID)
        .channels.cache.get(process.env.BUGS_ISSUES_CHANNEL_ID);

      const suggestionEmbed = new MessageEmbed()
        .setColor('#d32f2f')
        .setAuthor(
          `${message.member.nickname} reports : `,
          message.author.avatarURL(),
        )
        .setDescription(`> ${args.join` `}\n⠀`)
        .addField('👤 User', `\`${message.author.username}\``, true)
        .addField('🆔 User ID', `\`${message.author.id}\``, true)
        .addField('🏠 Guild', `\`${message.guild.name}\``, true)
        .addField('🆔 Guild ID', `\`${message.guild.id}\`\n⠀`, true)
        .setTimestamp();
      channel.send(suggestionEmbed);

      messageEmbed.setDescription('> Thanks for the report.\n⠀');
    }
    return message.channel.send(messageEmbed);
  },
};
