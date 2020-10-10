const { embedMessage } = require('../../utils/helpers');

module.exports = {
  name: 'vote',
  aliases: [],
  cooldown: 3,
  usage: 'vote',
  examples: ['vote'],
  description: 'Show how to vote for the bot.',
  async execute(message) {
    const messageEmbed = embedMessage(message);
    messageEmbed.setDescription(
      `> Vote **[here](https://top.gg/bot/${message.client.user.id})** to increase the visibility of the bot!\n⠀`,
    );
    return message.channel.send(messageEmbed);
  },
};
