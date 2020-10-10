const { embedMessage, addS } = require('../../utils/helpers');

module.exports = {
  name: 'mute',
  aliases: ['m'],
  cooldown: 3,
  usage: 'mute [[user] ...]',
  examples: ['mute', 'mute @user1', 'mute @user1 @user2 @user3'],
  description: 'Mutes all users or a specific user(s) in a certain channel.',
  guildOnly: true,
  async execute(message, prefix, args) {
    const messageEmbed = embedMessage(message);

    if (!message.member.voice.channel) {
      messageEmbed.setDescription(
        '> Please join a voice channel to use this command.\n⠀',
      );
    } else if (args.length === 0) {
      messageEmbed.setDescription(
        `> All members of \`${message.member.voice.channel.name}\` channel have been muted.\n⠀`,
      );
      message.member.voice.channel.members.each((member) => member.voice.setMute(true));
    } else {
      const mutedMembers = [];
      message.mentions.members.each((member) => {
        if (message.member.voice.channel.members.has(member.id)) {
          member.voice.setMute(true);
          mutedMembers.push(`\`${member.nickname || member.user.username}\``);
        }
      });

      if (mutedMembers.length > 0) {
        messageEmbed.setDescription(
          `> Member${addS(mutedMembers.length)} ${mutedMembers} of \`${
            message.member.voice.channel.name
          }\` channel ${
            mutedMembers.length === 1 ? 'has' : 'have'
          } been muted.\n⠀`,
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
