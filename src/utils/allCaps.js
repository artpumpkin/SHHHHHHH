const allCaps = (words) => words.split`-`.map((word) => word.toUpperCase()).join`_`;

module.exports = allCaps;
