/* globals jest */
/* eslint-disable no-unused-vars */

const seleniumMockFunction = jest
  .fn()
  .mockImplementation(driver => Promise.resolve());

module.exports = seleniumMockFunction;
