const { Prefix, Joindate, Role } = require('../models');
const { log, joinPeriod, addS } = require('../utils');

const onGuildDelete = async (client, guild) => {
  await Prefix.deleteOne({ guildID: guild.id });
  await Role.deleteOne({ guildID: guild.id });
  const doc = await Joindate.findOne({ guildID: guild.id });
  const days = joinPeriod(doc.createdAt);
  log(
    client,
    `🚽 Kicked from \`${guild.name}\` (${guild.id}) with ${
      guild.memberCount
    } member${addS(guild.memberCount)} after ${days} day${addS(days)} of use.`,
    process.env.LOGS_CHANNEL_ID,
  );
  await Joindate.deleteOne({ guildID: guild.id });
};

module.exports = onGuildDelete;
