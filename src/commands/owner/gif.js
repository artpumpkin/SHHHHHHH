const { URL, URLSearchParams } = require('url');
const fetch = require('node-fetch');
const { random } = require('../../utils/helpers');

module.exports = {
  name: 'gif',
  aliases: [],
  cooldown: 3,
  usage: 'gif [search]',
  examples: ['gif footbal'],
  description: 'Generate random gifs.',
  restricted: true,
  async execute(message, prefix, args) {
    const url = new URL('https://api.giphy.com/v1/gifs/search');
    url.search = new URLSearchParams({
      api_key: process.env.GIPHY_API_KEY,
      q: args.join` `,
      limit: 25,
    });
    const res = await fetch(url);
    const { data } = await res.json();
    const gifUrl = data[random(data.length)]?.url;
    if (gifUrl) {
      return message.channel.send(gifUrl);
    }
    return message.channel.send(`No gif found with the name of \`${gifUrl}\``);
  },
};
