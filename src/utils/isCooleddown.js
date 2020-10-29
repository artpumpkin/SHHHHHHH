const isCooleddown = (message, command) => {
  const { cooldowns } = message.client;
  const commandCooldowns = cooldowns.get(command.name);
  const timestamp = Date.now();
  const authorID = message.author.id;

  if (commandCooldowns) {
    const cooldown = commandCooldowns.find((cd) => cd.authorID === authorID);

    if (cooldown) {
      const timepassed = (Date.now() - cooldown.timestamp) / 1000;

      if (timepassed > command.cooldown) {
        cooldown.timestamp = Date.now();
      }

      const diff = command.cooldown - timepassed;
      if (diff > 0) {
        message.channel.send(
          `Time Remaining to use this command again is \`${
            Math.round(diff * 100) / 100
          }s\``,
        );

        return false;
      }

      return true;
    }
    commandCooldowns.push({
      authorID,
      timestamp,
    });

    return true;
  }

  cooldowns.set(command.name, [
    {
      authorID,
      timestamp,
    },
  ]);

  return true;
};

module.exports = isCooleddown;
