/* globals jest */

export default (reference, image, opts, callback) => {
  const equal = reference === image ? true : false;
  callback(null, equal);
};

const createDiff = jest.fn().mockImplementation((config, callback) => {
  callback(null);
});

export { createDiff };
