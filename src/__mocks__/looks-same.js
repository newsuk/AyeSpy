/* globals */

export default (reference, image, opts, callback) => {
  const equal = reference === image ? true : false;
  callback(null, equal);
};
