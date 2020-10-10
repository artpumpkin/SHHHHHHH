const Prefix = require('../models/prefix');
const Joindate = require('../models/joindate');
const { log, joinPeriod, addS } = require('../utils/helpers');

const onGuildDelete = async (client, guild) => {
  await Prefix.deleteOne({ guildID: guild.id });
  const doc = await Joindate.findOne({ guildID: guild.id });
  const days = joinPeriod(doc.createdAt);
  log(
    client,
    `🚽 Kicked from \`${guild.name}\` (${guild.id}) with ${
      guild.memberCount
    } member${addS(guild.memberCount)} after ${days} day${addS(days)} of use.`,
  );
  await Joindate.deleteOne({ guildID: guild.id });
};

module.exports = onGuildDelete;
