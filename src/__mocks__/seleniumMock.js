/* globals jest */

const seleniumMockFunction = jest
  .fn()
  .mockImplementation(driver => Promise.resolve()); //eslint-disable-line no-unused-vars

module.exports = seleniumMockFunction;
