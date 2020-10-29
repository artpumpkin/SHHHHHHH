const {
  embedMessage,
  addS,
  isAdmin,
  cleanDeletedRoles,
} = require('../../utils');
const { Role } = require('../../models');

module.exports = {
  name: 'removerole',
  aliases: ['remove'],
  cooldown: 3,
  usage: 'removerole [role(s)]',
  examples: ['removerole @staff', 'removerole @helper @crew'],
  description: 'Remove a specific role limitation.',
  guildOnly: true,
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    await cleanDeletedRoles(message.guild);

    if (!isAdmin(message.member)) {
      messageEmbed.setDescription(
        '> This command require `Administrator` permission.\n⠀',
      );
    } else if (args.length === 0) {
      messageEmbed.setDescription(
        "> You didn't specify a role or roles to remove.\n⠀",
      );
    } else {
      const removedRoles = await Promise.all(
        message.mentions.roles.map(async (role) => {
          await Role.updateOne(
            { guildID: role.guild.id },
            {
              guildID: role.guild.id,
              $pull: {
                roles: role.id,
              },
            },
          );

          await Role.deleteOne({ roles: [] });
          return `<@&${role.id}>`;
        }),
      );

      if (removedRoles.length > 0) {
        messageEmbed.setDescription(
          `> Role${addS(removedRoles.length)} ${removedRoles.join`, `} ${
            removedRoles.length === 1 ? 'has' : 'have'
          } been removed.`,
        );
      } else {
        messageEmbed.setDescription('> No mentioned roles to remove.\n⠀');
      }
    }
    return message.channel.send(messageEmbed);
  },
};
