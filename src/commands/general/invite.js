const { embedMessage } = require('../../utils/helpers');

module.exports = {
  name: 'invite',
  aliases: ['i', 'inv', 'invitebot', 'link'],
  cooldown: 3,
  usage: 'invite',
  examples: ['invite'],
  description: 'Get a link to invite the bot to your server.',
  async execute(message) {
    const messageEmbed = embedMessage(message);
    messageEmbed.setDescription(
      `<@${message.author.id}> [click here to invite **${message.client.user.username}** to your server.](https://discord.com/api/oauth2/authorize?client_id=${message.client.user.id}&permissions=8&scope=bot)\n⠀`,
    );
    return message.channel.send(messageEmbed);
  },
};
