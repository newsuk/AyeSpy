/* globals jest expect */
import fs from 'fs';
import {
  resolveImagePath,
  listRemote,
  deleteRemoteKey,
  fetchRemote,
  uploadRemote
} from './remoteActions';

jest.mock('fs');
jest.mock('path');

describe('Remote interactions', () => {
  it('when passed a valid key a path is returned', async () => {
    const config = {
      baseline: './e2eTests/baseline',
      latest: './e2eTests/latest',
      generatedDiffs: './e2eTests/generatedDiffs'
    };

    const returnedPath = await resolveImagePath('latest', config);
    expect(returnedPath).toEqual('mock/resolved/path');
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
    const data = await deleteRemoteKey(key, {
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
      [`mock/resolved/path/${imageName}`, 'buffer obj']
    ]);
  });

  it('uploads to the remote', async () => {
    const key = 'baseline';
    const config = {
      remoteRegion: 'region',
      browser: 'chrome',
      baseline: './e2eTests/baseline'
    };
    const file = ['file1'];

    fs.readdirSync.mockReturnValue(file);
    fs.createReadStream.mockReturnValue({
      on: () => {}
    });

    await uploadRemote(key, config)
      .then(promises => promises[0])
      .then(data => data.map(obj => obj.Key))
      .then(name => {
        expect(name).toEqual(['chrome/baseline/mock/resolved/path/file1']);
      });
  });
});
