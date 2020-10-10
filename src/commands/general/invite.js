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
      `<@${message.author.id}> [click here to invite **${message.client.user.username}** to your server.](https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=4194304)\n⠀`,
    );
    return message.channel.send(messageEmbed);
  },
};
