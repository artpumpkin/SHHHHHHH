const { embedMessage } = require('../../utils/helpers');
const Grant = require('../../models/grant');

module.exports = {
  name: 'grant',
  aliases: [],
  cooldown: 0,
  usage: 'grant [command] [[user] ...]',
  examples: ['grant', 'grant @user1', 'grant eval @user1'],
  description: 'Grants a command to a specific user.',
  restricted: true,
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    if (args.length === 0) {
      const docs = await Grant.find();
      const grants = docs.map(
        ({ userID, commands }) => `<@!${userID}> is granted with ${commands.map(
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
        const mentionedMembers = await Promise.all(
          message.mentions.members.map(async (member) => {
            await Grant.updateOne(
              { userID: member.id },
              {
                userID: member.id,
                $addToSet: {
                  commands: command.name,
                },
              },
              { upsert: true },
            );
            return {
              userID: member.id,
              name: `\`${member.nickname || member.user.username}\``,
            };
          }),
        );

        if (mentionedMembers.length === 0) {
          messageEmbed.setDescription('> No mentioned members to grant.\n⠀');
        } else {
          messageEmbed.setDescription(
            `User${mentionedMembers === 1 ? '' : 's'} ${mentionedMembers.map(
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
