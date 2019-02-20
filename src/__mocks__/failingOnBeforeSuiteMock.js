module.exports = function onBeforeSuiteMock() {
  throw new Error('Boom!');
};
