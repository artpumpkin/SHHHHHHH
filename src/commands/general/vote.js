const { embedMessage } = require('../../utils/helpers');

module.exports = {
  name: 'vote',
  aliases: [],
  cooldown: 3,
  usage: 'vote',
  examples: ['vote'],
  description: 'Shows how to vote for the bot.',
  async execute(message) {
    const messageEmbed = embedMessage(message);
    messageEmbed.setDescription(
      '> Vote **[here](https://top.gg/bot/761297770429939742)** to increase the visibility of the bot!\n⠀',
    );
    return message.channel.send(messageEmbed);
  },
};
