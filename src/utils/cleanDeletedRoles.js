const { Role } = require('../models');

const cleanDeletedRoles = async (guild) => {
  const roles = (await Role.findOne({ guildID: guild.id }))?.roles || [];

  for (const id of roles) {
    const role = await guild.roles.fetch(id);
    if (!role) {
      await Role.updateOne(
        { guildID: guild.id },
        {
          guildID: guild.id,
          $pull: {
            roles: id,
          },
        },
      );

      await Role.deleteOne({ roles: [] });
    }
  }
};

module.exports = cleanDeletedRoles;
