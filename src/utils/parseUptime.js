const moment = require('moment');

const parseUptime = (uptime) => {
  const duration = moment.duration(uptime, 'milliseconds');
  const s = duration.asSeconds().toFixed(0);
  const m = duration.asMinutes().toFixed(0);
  const h = duration.asHours().toFixed(0);
  const d = duration.asDays().toFixed(0);
  return `${d}d ${h % 24}h ${m % 60}m ${s % 60}s`;
};

module.exports = parseUptime;
