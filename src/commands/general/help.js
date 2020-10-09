const { embedMessage, title, allCaps } = require('../../utils/helpers');
const { EMOJIS } = require('../../utils/constants');
const { isOwner, isGranted } = require('../../client/SHHHHHHH');

module.exports = {
  name: 'help',
  aliases: ['h', 'commands', 'c'],
  cooldown: 3,
  usage: 'help [command]',
  examples: ['help', 'help mute'],
  description: 'Shows a list of commands, or command informations.',
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    const commands = {};
    message.client.commands.forEach(async (command) => {
      const userID = message.author.id;
      if (!command.restricted || isOwner(userID) || await isGranted(userID, command.name)) {
        if (!commands[command.category]) {
          commands[command.category] = [];
        }
        commands[command.category].push(`\`${command.name}\``);
      }
    });

    if (args.length === 0) {
      messageEmbed.setTitle('Bot Commands').setDescription(
        `> The bot's prefix ${
          message.channel.type === 'dm' ? '' : 'on this server '
        }is **\`${prefix}\`**.
         > For more informations try \`${prefix}help [command]\`.\n⠀`,
      );

      Object.keys(commands)
        .sort()
        .forEach((category) => {
          messageEmbed.addField(
            `${EMOJIS[allCaps(category)]} ${title(category)}`,
            `${commands[category].join`, `}\n⠀`,
            false,
          );
        });
    } else {
      const commandName = args[0].toLowerCase();
      const command = message.client.getCommand(commandName);
      if (
        command
        && (!command.whiteList || command.whiteList.includes(message.author.id))
      ) {
        messageEmbed
          .setTitle(`\`${command.name}\` | informations`)
          .setDescription(`> ${command.description}\n⠀`)
          .addField(
            ':zap: Triggers: ',
            [command.name, ...command.aliases].map((c) => `\`${c}\``).join`, `,
            true,
          )
          .addField(
            ':diamond_shape_with_a_dot_inside: Usage: ',
            `\`${prefix + command.usage}\`\n⠀`,
            true,
          )
          .addField(
            ':scroll: Examples: ',
            `${command.examples.map((example) => `\`${prefix + example}\``)
              .join`\n`}\n⠀`,
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
