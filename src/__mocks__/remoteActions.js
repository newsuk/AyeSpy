/* globals jest */

const createRemote = jest.fn().mockImplementation(() => Promise.resolve());
const deleteRemoteKeys = jest.fn().mockImplementation(() => Promise.resolve());
const fetchRemoteKeys = jest.fn().mockImplementation(() => Promise.resolve());

export { createRemote, deleteRemoteKeys, fetchRemoteKeys };
