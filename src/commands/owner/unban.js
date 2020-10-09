const { embedMessage } = require('../../utils/helpers');
const Ban = require('../../models/ban');

module.exports = {
  name: 'unban',
  aliases: [],
  cooldown: 0,
  usage: 'unban [user(s)]',
  examples: ['unban @user1', 'unban @user1 @user2'],
  description: 'Unban a specific user or users.',
  restricted: true,
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    if (args.length === 0) {
      messageEmbed.setDescription(
        "> You didn't specify a user or users to unban.\n⠀",
      );
    } else {
      const unbannedMembers = await Promise.all(
        message.mentions.members.map(async (member) => {
          await Ban.deleteOne({ userID: member.id });
          return `\`${member.nickname || member.user.username}\``;
        }),
      );

      if (unbannedMembers.length > 0) {
        messageEmbed.setDescription(
          `> Member${
            unbannedMembers.length === 1 ? '' : 's'
          } ${unbannedMembers} ${
            unbannedMembers.length === 1 ? 'has' : 'have'
          } been unbanned.\n⠀`,
        );
      } else {
        messageEmbed.setDescription('> No mentioned members to unban.\n⠀');
      }
    }
    return message.channel.send(messageEmbed);
  },
};
