/* globals jest */

const pug = {
  compileFile: jest.fn().mockImplementation(() => jest.fn())
};

export default pug;
