const { embedMessage } = require('../../utils');

module.exports = {
  name: 'donate',
  aliases: ['d'],
  cooldown: 3,
  usage: 'donate',
  examples: ['donate'],
  description: 'Show the donation\'s information.',
  async execute(message) {
    const messageEmbed = embedMessage(message);
    messageEmbed.setDescription(
      'You can donate using [Paypal](https://paypal.me/shhhhhhhbot) or [Patreon](https://www.patreon.com/shhhhhhh). All donations will be used towards hosting costs for the bot. Thank you so much for your support.\n⠀',
    );
    return message.channel.send(messageEmbed);
  },
};
