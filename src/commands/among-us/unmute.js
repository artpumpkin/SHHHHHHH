const { embedMessage } = require('../../utils/helpers');

module.exports = {
  name: 'unmute',
  aliases: ['u'],
  cooldown: 3,
  usage: 'unmute [[user] ...]',
  examples: [
    'unmute',
    'unmute @user1',
    'unmute @user1 @user2 @user3',
  ],
  description: 'Unmutes all users or a specific user(s) in a certain channel.',
  guildOnly: true,
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    if (!message.member.voice.channel) {
      messageEmbed.setDescription('> Please join a voice channel to use this command.\n⠀');
    } else if (args.length === 0) {
      messageEmbed.setDescription(
        `> All members of \`${message.member.voice.channel.name}\` channel have been unmuted.\n⠀`,
      );
      message.member.voice.channel.members.each((member) => member.voice.setMute(false));
    } else {
      const unmutedMembers = [];
      message.mentions.members.each((member) => {
        if (message.member.voice.channel.members.has(member.id)) {
          member.voice.setMute(false);
          unmutedMembers.push(`\`${member.nickname || member.user.username}\``);
        }
      });

      if (unmutedMembers.length > 0) {
        messageEmbed.setDescription(
          `> Member${
            unmutedMembers.length === 1 ? '' : 's'
          } ${unmutedMembers} of \`${
            message.member.voice.channel.name
          }\` channel ${
            unmutedMembers.length === 1 ? 'has' : 'have'
          } been unmuted.\n⠀`,
        );
      } else {
        messageEmbed.setDescription(
          `> Mentioned members aren't connected to \`${message.member.voice.channel.name}\` channel.\n⠀`,
        );
      }
    }
    return message.channel.send(messageEmbed);
  },
};
