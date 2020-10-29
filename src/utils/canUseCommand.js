const { Role } = require('../models');
const { isOwner } = require('../client');

const canUseCommand = async (message) => {
  const { roles = [] } = (await Role.findOne({ guildID: message.guild.id })) ?? {};
  return (
    isOwner(message.member.id)
    || roles.length === 0
    || message.member.roles.cache.some((role) => roles.includes(role.id))
  );
};

module.exports = canUseCommand;
