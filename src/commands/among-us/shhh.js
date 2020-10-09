const { URL, URLSearchParams } = require('url');
const fetch = require('node-fetch');
const { random } = require('../../utils/helpers');

module.exports = {
  name: 'shhh',
  aliases: ['shhhh', 'shhhhh', 'shhhhhh'],
  cooldown: 3,
  usage: 'shhh',
  examples: ['shhh'],
  description: 'Generate random shush gifs for fun.',
  async execute(message) {
    const url = new URL('https://api.giphy.com/v1/gifs/search');
    url.search = new URLSearchParams({
      api_key: process.env.GIPHY_API_KEY,
      q: 'sh',
      limit: 25,
    });

    const res = await fetch(url);
    const { data } = await res.json();
    const gifUrl = data[random(data.length)].url;
    return message.channel.send(gifUrl);
  },
};
