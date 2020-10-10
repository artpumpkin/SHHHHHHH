const { embedMessage, title, allCaps } = require('../../utils/helpers');
const { EMOJIS } = require('../../utils/constants');
const { isOwner, isGranted } = require('../../client/SHHHHHHH');

module.exports = {
  name: 'help',
  aliases: ['h', 'commands', 'c'],
  cooldown: 3,
  usage: 'help [command]',
  examples: ['help', 'help mute'],
  description: 'Show a list of commands, or command information.',
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    const commands = {};
    for (const command of message.client.commands.array()) {
      const userID = message.author.id;
      const owner = isOwner(userID);
      const granted = await isGranted(userID, command.name);
      if (!command.restricted || owner || granted) {
        if (!commands[command.category]) {
          commands[command.category] = [];
        }
        commands[command.category].push(`\`${command.name}\``);
      }
    }

    if (args.length === 0) {
      messageEmbed.setTitle('Bot Commands').setDescription(
        `> The bot's prefix ${
          message.channel.type === 'dm' ? '' : 'on this server '
        }is **\`${prefix}\`**.
         > For more information try \`${prefix}help [command]\`.\n⠀`,
      );

      const categories = Object.keys(commands).sort();

      for (const category of categories) {
        messageEmbed.addField(
          `${EMOJIS[allCaps(category)]} ${title(category)}`,
          `${commands[category].join`, `}\n⠀`,
          false,
        );
      }
    } else {
      const commandName = args[0].toLowerCase();
      const command = message.client.getCommand(commandName);
      if (
        command
        && (!command.whiteList || command.whiteList.includes(message.author.id))
      ) {
        messageEmbed
          .setTitle(`\`${command.name}\` | information`)
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
