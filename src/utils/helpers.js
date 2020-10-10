const path = require('path');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

const joinPeriod = (createdAt) => {
  const diff = moment().diff(Number(createdAt), 'milliseconds');
  return Math.floor(moment.duration(diff, 'milliseconds').asDays());
};

const parseUptime = (uptime) => {
  const duration = moment.duration(uptime, 'milliseconds');
  const s = duration.asSeconds().toFixed(0);
  const m = duration.asMinutes().toFixed(0);
  const h = duration.asHours().toFixed(0);
  const d = duration.asDays().toFixed(0);
  return `${d}d ${h % 24}h ${m % 60}m ${s % 60}s`;
};

const random = (max) => Math.floor(Math.random() * max);

const createImposterImage = async (name) => {
  const width = 960;
  const height = 540;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const image = await loadImage(
    path.resolve(__dirname, '../assets/imposter-background.png'),
  );

  ctx.drawImage(image, 0, 0, width, height);

  ctx.font = '30px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, width / 2, height / 2 + 180);

  return canvas.toBuffer();
};

const embedMessage = (message) => {
  const { tag } = message.author;
  return new MessageEmbed()
    .setColor('#c43421')
    .setFooter(`Requested by ${tag}`, message.author.avatarURL())
    .setTimestamp();
};

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

const title = (words) => words.split`-`.map((word) => word[0].toUpperCase() + word.slice(1)).join` `;

const allCaps = (words) => words.split`-`.map((word) => word.toUpperCase()).join`_`;

const log = async (client, message) => {
  const logsChannel = client.guilds.cache
    .get(process.env.SUPPORT_GUILD_ID)
    .channels.cache.get(process.env.LOGS_CHANNEL_ID);

  const logEmbed = new MessageEmbed()
    .setColor('#1976d2')
    .setDescription(message)
    .setTimestamp();
  logsChannel.send(logEmbed);
};

const findAsync = async (elements, callback) => {
  for (const element of elements) {
    if (await callback(element)) {
      return element;
    }
  }
  return undefined;
};

const addS = (count) => (count === 1 ? '' : 's');

module.exports = {
  joinPeriod,
  parseUptime,
  random,
  createImposterImage,
  embedMessage,
  isCooleddown,
  title,
  allCaps,
  log,
  findAsync,
  addS,
};
