const Prefix = require('../../models/prefix');
const { embedMessage } = require('../../utils/helpers');

module.exports = {
  name: 'prefix',
  aliases: ['p', 'pf'],
  cooldown: 3,
  usage: 'prefix [prefix]',
  examples: ['prefix', 'prefix !', 'prefix _'],
  description: 'Show or changes the bot\'s prefix.',
  guildOnly: true,
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    if (args.length === 0) {
      messageEmbed.setDescription(`> My prefix is **\`${prefix}\`**.\n⠀`);
    } else {
      await Prefix.updateOne(
        { guildID: message.guild.id },
        {
          guildID: message.guild.id,
          prefix: args[0],
        }, {
          upsert: true,
        },
      );
      messageEmbed.setDescription(
        `> Prefix has been set to **\`${args[0]}\`**.\n⠀`,
      );
    }
    return message.channel.send(messageEmbed);
  },
};
