const { embedMessage, addS, getUserIDs } = require('../../utils/helpers');
const Grant = require('../../models/grant');

module.exports = {
  name: 'revoke',
  aliases: [],
  cooldown: 0,
  usage: 'revoke [command] [[user] ...]',
  examples: ['revoke', 'revoke @user1', 'revoke eval @user1'],
  description: 'Revoke a command from a specific user.',
  restricted: true,
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    if (args.length === 0) {
      messageEmbed.setDescription('> No commands to revoke.\n⠀');
    } else {
      const commandName = args[0].toLowerCase();
      const command = message.client.getCommand(commandName);

      if (command) {
        const mentionedMembers = (
          await Promise.all(
            getUserIDs(args).map(async (userID) => {
              try {
                const user = await message.client.users.fetch(userID);
                await Grant.updateOne(
                  { userID },
                  {
                    userID,
                    $pull: {
                      commands: command.name,
                    },
                  },
                );

                await Grant.deleteOne({ commands: [] });
                return {
                  userID,
                  name: `\`${user.username}\` (\`${user.id}\`)`,
                };
              } catch (e) {
                return null;
              }
            }),
          )
        ).filter((e) => e !== null);

        if (mentionedMembers.length === 0) {
          messageEmbed.setDescription(
            '> No mentioned members to revoke from.\n⠀',
          );
        } else {
          messageEmbed.setDescription(
            `User${addS(mentionedMembers)} ${mentionedMembers.map(
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
