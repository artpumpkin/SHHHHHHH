const { DEFAULT_PREFIX } = require('../utils/constants');
const Ban = require('../models/ban');
const Prefix = require('../models/prefix');
const { embedMessage, isCooleddown, findAsync } = require('../utils/helpers');

const onMessage = async (client, message) => {
  try {
    if (await Ban.exists({ userID: message.author.id })) return;

    let prefix = DEFAULT_PREFIX;
    if (message.guild) {
      const doc = await Prefix.findOne({ guildID: message.guild.id });
      prefix = doc?.prefix || prefix;
    }

    const match = new RegExp(`^<@!?${client.user.id}>`).test(message.content);
    if (
      (!message.content.startsWith(prefix) || message.author.bot)
      && (!match || message.author.bot)
    ) {
      return;
    }

    const args = message.content
      .slice(match ? client.user.id.length + 4 : prefix.length)
      .trim()
      .split(/\s+/)
      .filter((e) => e !== '');

    let embed = null;
    if (match && args.length === 0) {
      const messageEmbed = embedMessage(message);
      messageEmbed.setDescription(`> My prefix is **\`${prefix}\`** _(you can also mention me)_.
      > To show all the available commands use **\`${`${prefix}help`}\`**.\n⠀`);
      embed = await message.channel.send(messageEmbed);
    } else {
      const commandName = args.shift().toLowerCase();
      const command = await findAsync(client.commands.array(), async (c) => {
        const commandExists = c.name === commandName || c.aliases.includes(commandName);
        const isOwner = client.constructor.isOwner(message.author.id);
        const isGranted = await client.constructor.isGranted(
          message.author.id,
          c.name,
        );
        const notRestricted = !c.restricted;
        return commandExists && (notRestricted || isOwner || isGranted);
      });

      if (command) {
        if (command.guildOnly && message.channel.type === 'dm') {
          const messageEmbed = embedMessage(message);
          messageEmbed.setDescription(
            '> This command cannot be used in DMs.\n⠀',
          );
          embed = await message.channel.send(messageEmbed);
        } else if (isCooleddown(message, command)) {
          embed = await command.execute(message, prefix, args);
        }
      }
    }
    if (embed) {
      await embed.react('🗑️');
      const collected = await embed.awaitReactions(
        (reaction, user) => reaction.emoji.name === '🗑️' && user.id === message.author.id,
        { time: 5000, max: 1 },
      );
      if (collected.size === 1) {
        embed.delete();
      } else {
        embed.reactions.cache.get('🗑️').users.remove(embed.author);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = onMessage;
