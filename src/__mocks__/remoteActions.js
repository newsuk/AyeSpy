/* globals jest */

const createRemote = jest.fn().mockImplementation(() => Promise.resolve());
const deleteRemote = jest.fn().mockImplementation(() => Promise.resolve());
const fetchRemote = jest.fn().mockImplementation(() => Promise.resolve());

export { createRemote, deleteRemote, fetchRemote };
