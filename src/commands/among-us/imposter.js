const { MessageAttachment } = require('discord.js');
const {
  embedMessage,
  random,
  createImposterImage,
} = require('../../utils/helpers');

module.exports = {
  name: 'imposter',
  aliases: ['who'],
  cooldown: 3,
  usage: 'imposter [[user] ...]',
  examples: ['imposter', 'imposter @user1', 'imposter @user1 @user2 @user3'],
  description:
    'Guess the imposter from a voice channel or a group of mentioned users.',
  guildOnly: true,
  async execute(message) {
    const messageEmbed = embedMessage(message);
    const { members } = message.mentions;
    const { channel } = message.member.voice;

    if (members.size !== 0 || channel) {
      let member = null;
      const mapCallback = (m) => ({
        name: m.nickname ?? m.user.username,
        mention: `<@${m.id}>`,
      });

      let mentionedMembers = null;
      if (members.size !== 0) {
        mentionedMembers = members.map(mapCallback);
      } else if (channel) {
        mentionedMembers = channel.members.map(mapCallback);
      }
      member = mentionedMembers[random(mentionedMembers.length)];

      const attachment = new MessageAttachment(
        await createImposterImage(`${member.name}`),
        'welcome-image.png',
      );
      return message.channel.send(
        `I think ${member.mention} is \`${random(101)}%\` imposter!`,
        attachment,
      );
    }
    messageEmbed.setDescription(
      '> Please mention some users or join a voice channel to guess the imposter.\n⠀',
    );

    return message.channel.send(messageEmbed);
  },
};
