const getUserIDs = (args) => [...new Set(args.join` `.match(/\d+/g))];

module.exports = getUserIDs;
