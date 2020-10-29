const {
  embedMessage,
  isCooleddown,
  findAsync,
  log,
} = require('../utils');
const {
  isBanned,
  getPrefix,
  isMentionUsed,
  isPrefixUsed,
  isOwner,
  isGranted,
} = require('../client');

const onMessage = async (client, message) => {
  try {
    if (await isBanned(message.author.id)) return;

    const prefix = await getPrefix(message.guild);

    const mentionUsed = isMentionUsed(message, client.user.id);
    const prefixUsed = isPrefixUsed(message, prefix);

    if (!prefixUsed && !mentionUsed) return;

    const args = message.content
      .slice(mentionUsed ? mentionUsed.length : prefix.length)
      .trim()
      .split(/\s+/)
      .filter((e) => e !== '');

    let embed = null;
    if (mentionUsed && args.length === 0) {
      const messageEmbed = embedMessage(message);
      messageEmbed.setDescription(`> My prefix is **\`${prefix}\`** _(you can also mention me)_.
      > To show all the available commands use **\`${`${prefix}help`}\`**.\n⠀`);
      embed = await message.channel.send(messageEmbed);
    } else if (prefixUsed && args.length === 0) {
      await message.channel.send("That's my prefix :)");
    } else {
      const commandName = args.shift().toLowerCase();
      const command = await findAsync(client.commands.array(), async (c) => {
        const commandExists = c.name === commandName || c.aliases.includes(commandName);
        const owner = isOwner(message.author.id);
        const granted = await isGranted(message.author.id, c.name);
        const notRestricted = !c.restricted;
        return commandExists && (notRestricted || owner || granted);
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

        log(
          client,
          `> \`${message.author.username}\` (\`${message.author.id}\`) used \`${
            command.name
          }\` ${args.length > 0 ? `\`${args.join` `}\` ` : ''}in \`${
            message.guild.name
          }\``,
          process.env.REQUESTS_CHANNEL_ID,
        );
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
    log(
      client,
      `> \`${message.guild.name}\` (${message.guild.id})
\`\`\`js
${message.author.username} (${message.author.id}) content: ${message.content} \`\`\`
\`\`\`js
${e} \`\`\``,
      process.env.ERRORS_CHANNEL_ID,
    );
  }
};

module.exports = onMessage;
