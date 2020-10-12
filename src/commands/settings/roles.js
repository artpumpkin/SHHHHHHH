const { embedMessage, addS } = require('../../utils/helpers');
const Role = require('../../models/role');

module.exports = {
  name: 'roles',
  aliases: ['role'],
  cooldown: 3,
  usage: 'roles',
  examples: ['roles'],
  description: 'Show all added roles.',
  guildOnly: true,
  async execute(message) {
    const messageEmbed = embedMessage(message);

    const roles = (await Role.findOne({ guildID: message.guild.id }))?.roles || [];

    if (roles.length > 0) {
      const roleNames = await Promise.all(
        roles.map(async (id) => {
          const role = await message.guild.roles.fetch(id);
          return `\`${role.name}\``;
        }),
      );
      messageEmbed.setDescription(
        `> Required role${addS(roles.length)} for this guild ${
          roles.length === 1 ? 'is' : 'are'
        } ${roleNames.join`, `}.`,
      );
    } else {
      messageEmbed.setDescription(
        '> No roles have been added to this guild.\n⠀',
      );
    }
    return message.channel.send(messageEmbed);
  },
};
