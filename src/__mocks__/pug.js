/* globals jest */

const pug = jest.genMockFromModule('./pug');
const compileTemplate = jest.fn();
pug.compileFile = jest.fn().mockImplementation(() => {
  return compileTemplate;
});

export default pug;
