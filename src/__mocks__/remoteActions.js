/* globals jest */

const createRemote = jest.fn().mockImplementation(() => Promise.resolve());
const deleteRemoteKey = jest.fn().mockImplementation(() => Promise.resolve());
const fetchRemote = jest.fn().mockImplementation(() => Promise.resolve());

export { createRemote, deleteRemoteKey, fetchRemote };
