/* globals jest expect */
import fs from 'fs';
import path from 'path';
import {
  resolveImagePath,
  listRemote,
  deleteRemote,
  fetchRemote
} from './remoteActions';

jest.mock('fs');

describe('Remote interactions', () => {
  it('when passed a valid key a path is returned', async () => {
    const config = {
      baseline: './e2eTests/baseline',
      latest: './e2eTests/latest',
      generatedDiffs: './e2eTests/generatedDiffs'
    };

    const returnedPath = await resolveImagePath('latest', config);
    expect(returnedPath).toEqual(path.resolve(config.latest));
  });

  it('when passed an invalid key no path should return', async () => {
    const config = {
      baseline: './e2eTests/baseline',
      latest: './e2eTests/latest',
      generatedDiffs: './e2eTests/generatedDiffs'
    };

    try {
      await resolveImagePath('', config);
    } catch (error) {
      expect(error).toEqual(
        'The key did not match any of the available options'
      );
    }
  });

  it('lists and filters remote objects', async () => {
    const key = 'latest';
    const data = await listRemote(key, {
      remoteRegion: 'region',
      browser: 'chrome'
    });
    expect(data.every(obj => obj.Key.includes(key))).toBe(true);
    expect(data.every(obj => !obj.Key.includes('baseline'))).toBe(true);
  });

  it('deletes filtered remote objects', async () => {
    const key = 'latest';
    const data = await deleteRemote(key, {
      remoteRegion: 'region',
      browser: 'chrome'
    });
    expect(data.every(obj => obj.Key.includes(key))).toBe(true);
    expect(data.every(obj => !obj.Key.includes('baseline'))).toBe(true);
  });

  it('fetches remote objects', async () => {
    const key = 'latest';
    const imageName = '3homepage';
    const config = {
      remoteRegion: 'region',
      browser: 'chrome',
      latest: './e2eTests/latest'
    };
    await fetchRemote(config, key, imageName);
    expect(fs.writeFileSync.mock.calls).toEqual([
      [`${path.resolve(config.latest)}/${imageName}`, 'buffer obj']
    ]);
  });
});
