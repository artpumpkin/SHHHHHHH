const { embedMessage, addS, getUserIDs } = require('../../utils/helpers');
const Ban = require('../../models/ban');

module.exports = {
  name: 'ban',
  aliases: [],
  cooldown: 0,
  usage: 'ban [user(s)]',
  examples: ['ban @user1', 'ban @user1 @user2'],
  description: 'Ban a specific user or users.',
  restricted: true,
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    if (args.length === 0) {
      messageEmbed.setDescription(
        "> You didn't specify a user or users to ban.\n⠀",
      );
    } else {
      const bannedMembers = (
        await Promise.all(
          getUserIDs(args).map(async (userID) => {
            try {
              const user = await message.client.users.fetch(userID);
              await Ban.updateOne(
                { userID },
                { userID },
                {
                  upsert: true,
                },
              );
              return `\`${user.username}\` (\`${user.id}\`)`;
            } catch (e) {
              return null;
            }
          }),
        )
      ).filter((e) => e !== null);

      if (bannedMembers.length > 0) {
        messageEmbed.setDescription(
          `> Member${addS(bannedMembers.length)} ${bannedMembers.join`, `} ${
            bannedMembers.length === 1 ? 'has' : 'have'
          } been banned.\n⠀`,
        );
      } else {
        messageEmbed.setDescription('> No mentioned members to ban.\n⠀');
      }
    }
    return message.channel.send(messageEmbed);
  },
};
