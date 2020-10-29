const { embedMessage } = require('../../utils');

module.exports = {
  name: 'eval',
  aliases: ['e', 'ev', 'evaluate'],
  cooldown: 0,
  usage: 'eval [expression]',
  examples: ['eval expression'],
  description: 'Evaluate a JavaScript expression.',
  restricted: true,
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    if (args.length === 0) {
      messageEmbed.setDescription(
        "> You didn't specify an expression to evaluate.\n⠀",
      );
    } else {
      const expression = args.join` `;
      let result = null;
      try {
        // eslint-disable-next-line no-eval
        result = eval(expression);
      } catch (e) {
        result = e;
      }
      messageEmbed.setDescription(`:joystick: **Expression**
      \`\`\`js
${expression} \`\`\`\n:pencil: **Result**
      \`\`\`
${result} \`\`\`⠀`);
    }
    return message.channel.send(messageEmbed);
  },
};
