const { Permissions } = require('discord.js');

const isAdmin = (member) => member.hasPermission(Permissions.FLAGS.ADMINISTRATOR);

module.exports = isAdmin;
