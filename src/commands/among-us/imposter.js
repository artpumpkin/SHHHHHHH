const { MessageAttachment } = require('discord.js');
const {
  embedMessage,
  random,
  createImposterImage,
  getUserIDs,
} = require('../../utils');

module.exports = {
  name: 'imposter',
  aliases: ['who'],
  cooldown: 3,
  usage: 'imposter [[user] ...]',
  examples: ['imposter', 'imposter @user1', 'imposter @user1 @user2 @user3'],
  description:
    'Guesses the imposter from a voice channel or a group of mentioned users.',
  guildOnly: true,
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);
    let ids = getUserIDs(args);
    const { channel } = message.member.voice;

    if (ids.length !== 0 || channel) {
      if (ids.length === 0) {
        ids = channel.members.map((m) => m.id);
      }

      const cachedMember = message.guild.members.cache.get(
        ids[random(ids.length)],
      );

      if (cachedMember) {
        const member = {
          name: cachedMember.nickname ?? cachedMember.user.username,
          mention: `<@${cachedMember.id}>`,
        };

        const attachment = new MessageAttachment(
          await createImposterImage(`${member.name}`),
          'welcome-image.png',
        );
        return message.channel.send(
          `I think ${member.mention} is \`${random(101)}%\` imposter!`,
          attachment,
        );
      }
    }
    messageEmbed.setDescription(
      '> Please mention some users or join a voice channel to guess the imposter.\n⠀',
    );

    return message.channel.send(messageEmbed);
  },
};
