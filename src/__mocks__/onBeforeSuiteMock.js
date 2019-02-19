/* globals jest */
module.exports = function onBeforeSuiteMock(...params) {
  return jest.fn(params);
};
