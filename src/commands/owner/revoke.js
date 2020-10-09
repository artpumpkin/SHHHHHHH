const { embedMessage } = require('../../utils/helpers');
const Grant = require('../../models/grant');

module.exports = {
  name: 'revoke',
  aliases: [],
  cooldown: 0,
  usage: 'revoke [command] [[user] ...]',
  examples: ['revoke', 'revoke @user1', 'revoke eval @user1'],
  description: 'Revokes a command from a specific user.',
  restricted: true,
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    if (args.length === 0) {
      messageEmbed.setDescription('> No commands to revoke.\n⠀');
    } else {
      const commandName = args[0].toLowerCase();
      const command = message.client.getCommand(commandName);

      if (command) {
        const mentionedMembers = await Promise.all(
          message.mentions.members.map(async (member) => {
            await Grant.updateOne(
              { userID: member.id },
              {
                userID: member.id,
                $pull: {
                  commands: command.name,
                },
              },
            );

            await Grant.deleteOne({ commands: [] });

            return {
              userID: member.id,
              name: `\`${member.nickname || member.user.username}\``,
            };
          }),
        );

        if (mentionedMembers.length === 0) {
          messageEmbed.setDescription(
            '> No mentioned members to revoke from.\n⠀',
          );
        } else {
          messageEmbed.setDescription(
            `User${mentionedMembers === 1 ? '' : 's'} ${mentionedMembers.map(
              (m) => m.name,
            )} ${mentionedMembers === 1 ? 'has' : 'have'} been revoked from \`${
              command.name
            }\` command.\n⠀`,
          );
        }
      } else {
        messageEmbed.setDescription(
          `> Command or alias \`${commandName}\` doesn't exist.\n⠀`,
        );
      }
    }
    return message.channel.send(messageEmbed);
  },
};
