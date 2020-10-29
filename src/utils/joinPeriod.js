const moment = require('moment');

const joinPeriod = (createdAt) => {
  const diff = moment().diff(Number(createdAt), 'milliseconds');
  return Math.floor(moment.duration(diff, 'milliseconds').asDays());
};

module.exports = joinPeriod;
