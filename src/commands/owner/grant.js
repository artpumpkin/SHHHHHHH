const { embedMessage, addS, getUserIDs } = require('../../utils');
const { Grant } = require('../../models');

module.exports = {
  name: 'grant',
  aliases: [],
  cooldown: 0,
  usage: 'grant [command] [[user] ...]',
  examples: ['grant', 'grant @user1', 'grant eval @user1'],
  description: 'Grant a command to a specific user.',
  restricted: true,
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    if (args.length === 0) {
      const docs = await Grant.find();
      const grants = docs.map(
        ({ userID, commands }) => `<@${userID}> is granted with ${commands.map(
          (command) => `\`${command}\``,
        ).join`, `}.`,
      );

      if (grants.length === 0) {
        messageEmbed.setDescription('> No granted users.\n⠀');
      } else {
        messageEmbed.setDescription(`**Granted Users**
        ${grants}\n⠀`);
      }
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
                    $addToSet: {
                      commands: command.name,
                    },
                  },
                  { upsert: true },
                );
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
          messageEmbed.setDescription('> No mentioned members to grant.\n⠀');
        } else {
          messageEmbed.setDescription(
            `User${addS(mentionedMembers)} ${mentionedMembers.map(
              (m) => m.name,
            )} ${mentionedMembers === 1 ? 'has' : 'have'} been granted with \`${
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
