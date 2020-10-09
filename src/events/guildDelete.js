const Prefix = require('../models/prefix');
const Joindate = require('../models/joindate');
const { log, joinPeriod } = require('../utils/helpers');

const onGuildDelete = async (client, guild) => {
  await Prefix.deleteOne({ guildID: guild.id });
  const doc = await Joindate.findOne({ guildID: guild.id });
  const days = joinPeriod(doc.createdAt);
  log(
    `🚽 Kicked from \`${guild.name}\` after ${days} day${
      days === 1 ? '' : 's'
    } of use.`,
  );
  await Joindate.deleteOne({ guildID: guild.id });
};

module.exports = onGuildDelete;
