const fs = require('fs');
const path = require('path');
const { Client, Collection } = require('discord.js');
const Prefix = require('../models/prefix');
const Grant = require('../models/grant');
const Ban = require('../models/ban');
const { DEFAULT_PREFIX } = require('../utils/constants');

class SHHHHHHH extends Client {
  constructor() {
    super();
    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.populateCommands();
    this.handleEvents();
  }

  populateCommands() {
    const categories = fs.readdirSync(path.resolve(__dirname, '../commands'));
    for (const category of categories) {
      const commandFiles = fs.readdirSync(
        path.resolve(__dirname, `${'../commands/'}${category}`),
      );
      for (const file of commandFiles) {
        const command = require(`../commands/${category}/${file}`);
        command.category = category;
        this.commands.set(command.name, command);
      }
    }
  }

  handleEvents() {
    const eventFiles = fs.readdirSync(path.resolve(__dirname, '../events'));
    const eventNames = eventFiles.map((fileName) => fileName.replace('.js', ''));
    for (const eventName of eventNames) {
      const eventHandler = require(`../events/${eventName}`);
      this[eventName === 'ready' ? 'once' : 'on'](eventName, (...args) => eventHandler(this, ...args));
    }
  }

  getCommand(name) {
    return this.commands.find(
      (c) => c.name === name || c.aliases.includes(name),
    );
  }

  static async getPrefix(guild) {
    const prefix = DEFAULT_PREFIX;
    if (guild) {
      const doc = await Prefix.findOne({ guildID: guild.id });
      return doc?.prefix || prefix;
    }
    return prefix;
  }

  static isMentionUsed(message, userID) {
    const match = new RegExp(`^<@!?${userID}>`).test(message.content);
    return match && !message.author.bot;
  }

  static isPrefixUsed(message, prefix) {
    return message.content.startsWith(prefix) && !message.author.bot;
  }

  static isOwner(userID) {
    return process.env.OWNER_ID === userID;
  }

  static async isGranted(userID, command) {
    const doc = await Grant.findOne({ userID });
    return doc?.commands.includes(command);
  }

  static async isBanned(userID) {
    return Ban.exists({ userID });
  }
}

module.exports = SHHHHHHH;
