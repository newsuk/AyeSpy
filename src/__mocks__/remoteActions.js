/* globals jest */

const listRemoteData = [
  {
    Key: 'chrome/e2eTests/default/generatedDiffs/test_article-desktop.png',
    LastModified: '2019-02-04T13:05:21.000Z',
    ETag: '"ce1b7051ac5c2d8b9ddc45a0cea91b50"',
    Size: 1347664,
    StorageClass: 'STANDARD'
  }
];

const createRemote = jest.fn().mockImplementation(() => Promise.resolve());
const deleteRemoteKeys = jest.fn().mockImplementation(() => Promise.resolve());
const fetchRemoteKeys = jest.fn().mockImplementation(() => Promise.resolve());
const uploadRemoteKeys = jest.fn().mockImplementation(() => Promise.resolve());
const listRemoteKeys = jest
  .fn()
  .mockImplementation(() => Promise.resolve(listRemoteData));

export {
  createRemote,
  deleteRemoteKeys,
  fetchRemoteKeys,
  uploadRemoteKeys,
  listRemoteKeys
};
