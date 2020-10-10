const { embedMessage, parseUptime } = require('../../utils/helpers');

module.exports = {
  name: 'info',
  aliases: ['about', 'stats'],
  cooldown: 3,
  usage: 'info',
  examples: ['info'],
  description: 'Show information about the bot and its owner.',
  async execute(message) {
    const messageEmbed = embedMessage(message);
    messageEmbed
      .setTitle(message.client.user.username)
      .setThumbnail('https://i.imgur.com/dE9tW1o.png')
      .setDescription(
        `${message.client.user.username} was created especially to shush people while playing Among Us! A simple and easy to use Discord bot to mute and unmute people while playing!`,
      )
      .addField(':homes: Guilds', message.client.guilds.cache.size, true)
      .addField(
        ':busts_in_silhouette: Users',
        message.client.guilds.cache
          .map((guild) => guild.members.cache.size)
          .reduce((total, current) => total + current),
        true,
      )
      .addField(':timer: Uptime', parseUptime(message.client.uptime), true)
      .addField(
        ':ninja: Owner',
        `[GitHub](https://github.com/artpumpkin)
      [Instagram](https://www.instagram.com/artpumpkin4real/)`,
        true,
      )
      .addField(
        ':spider_web: Links',
        `[Invite](https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=4194304)
      [Vote](https://top.gg/bot/${message.client.user.id}/vote)
      [Donate](https://paypal.me/shhhhhhhbot)`,
        true,
      )
      .addField(
        ':dividers: General',
        `Commands: ${message.client.commands.size}
      Library: [Discord.js](https://github.com/discordjs)\n⠀`,
        true,
      );
    return message.channel.send(messageEmbed);
  },
};
