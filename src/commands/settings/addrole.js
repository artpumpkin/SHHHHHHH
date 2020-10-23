const {
  embedMessage,
  addS,
  isAdmin,
  cleanDeletedRoles,
} = require('../../utils/helpers');
const Role = require('../../models/role');
const { NUMBER_OF_ROLES_PER_GUILD } = require('../../utils/constants');

module.exports = {
  name: 'addrole',
  aliases: ['add'],
  cooldown: 3,
  usage: 'addrole [role(s)]',
  examples: ['addrole @staff', 'addrole @helper @crew'],
  description: `Limit the bot to a specific role (${NUMBER_OF_ROLES_PER_GUILD} is the roles limit).`,
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
        "> You didn't specify a role or roles to add.\n⠀",
      );
    } else {
      const doc = await Role.findOne({ guildID: message.guild.id });
      const mentionedRoles = message.mentions.roles;
      const addedRoles = await Promise.all(
        mentionedRoles
          .array()
          .filter(
            (_, index) => index + (doc?.roles || []).length + 1 <= NUMBER_OF_ROLES_PER_GUILD,
          )
          .map(async (role) => {
            await Role.updateOne(
              { guildID: role.guild.id },
              {
                guildID: role.guild.id,
                $addToSet: {
                  roles: role.id,
                },
              },
              { upsert: true },
            );
            return `<@&${role.id}>`;
          }),
      );
      const deniedRoles = mentionedRoles
        .map((role) => `<@&${role.id}>`)
        .filter((role) => !addedRoles.includes(role));

      if (mentionedRoles.size > 0) {
        let description = '';
        if (addedRoles.length > 0) {
          description += `> Role${addS(
            addedRoles.length,
          )} ${addedRoles.join`, `} ${
            addedRoles.length === 1 ? 'has' : 'have'
          } been added.${deniedRoles.length > 0 ? '\n' : ''}`;
        }
        if (deniedRoles.length > 0) {
          description += `> Role${addS(
            deniedRoles.length,
          )} ${deniedRoles.join`, `} couldn't be added.
            _(roles limit is ${NUMBER_OF_ROLES_PER_GUILD})_`;
        }
        messageEmbed.setDescription(`${description}\n⠀`);
      } else {
        messageEmbed.setDescription('> No mentioned roles to add.\n⠀');
      }
    }
    return message.channel.send(messageEmbed);
  },
};
