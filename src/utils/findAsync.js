const findAsync = async (elements, callback) => {
  for (const element of elements) {
    if (await callback(element)) {
      return element;
    }
  }
  return undefined;
};

module.exports = findAsync;
