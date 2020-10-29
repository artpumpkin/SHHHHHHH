const path = require('path');
const { embedMessage } = require('../../utils');

module.exports = {
  name: 'reload',
  aliases: [],
  cooldown: 0,
  usage: 'reload [command]',
  examples: ['reload', 'reload help'],
  description: 'Reload a specific command.',
  restricted: true,
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    if (args.length === 0) {
      messageEmbed.setDescription(
        "> You didn't specify a command to reload.\n⠀",
      );
    } else {
      const commandName = args[0].toLowerCase();
      const command = message.client.getCommand(commandName);

      if (command) {
        const commandPath = path.resolve(
          __dirname,
          `../${command.category}/${command.name}`,
        );
        delete require.cache[require.resolve(commandPath)];
        message.client.commands.set(command.name, require(commandPath));
        messageEmbed.setDescription(
          `> Command \`${commandName}\` reloaded successfully.\n⠀`,
        );
      } else {
        messageEmbed.setDescription(
          `> Command or alias \`${commandName}\` doesn't exist.\n⠀`,
        );
      }
    }
    return message.channel.send(messageEmbed);
  },
};
