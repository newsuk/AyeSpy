/* globals jest expect */
import fs from 'fs';
import {
  resolveImagePath,
  listRemoteKeys,
  deleteRemoteKeys,
  fetchRemoteKeys,
  uploadRemoteKeys,
  archiveRemoteKeys
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
    const data = await listRemoteKeys(key, {
      remoteRegion: 'region',
      browser: 'chrome'
    });
    expect(data.every(obj => obj.Key.includes(key))).toBe(true);
    expect(data.every(obj => !obj.Key.includes('baseline'))).toBe(true);
  });

  it('lists and filters remote objects with branch folder', async () => {
    const key = 'latest';
    const data = await listRemoteKeys(key, {
      remoteRegion: 'region',
      browser: 'chrome',
      branch: 'branch'
    });
    expect.assertions(data.length * 2);
    data.forEach(obj => {
      expect(obj.Key.includes(key)).toBe(true);
      expect(!obj.Key.includes('baseline')).toBe(true);
    });
  });

  it('lists and filters remote objects on baseline with branch param', async () => {
    const key = 'baseline';
    const data = await listRemoteKeys(key, {
      remoteRegion: 'region',
      browser: 'chrome',
      branch: 'branch'
    });
    expect.assertions(data.length * 2);
    data.forEach(obj => {
      expect(obj.Key.includes(key)).toBe(true);
      expect(!obj.Key.includes('branch')).toBe(true);
    });
  });

  it('deletes filtered remote objects', async () => {
    const key = 'latest';
    const data = await deleteRemoteKeys(key, {
      remoteRegion: 'region',
      browser: 'chrome',
      branch: 'default'
    });
    expect(data.every(obj => obj.Key.includes(key))).toBe(true);
    expect(data.every(obj => !obj.Key.includes('baseline'))).toBe(true);
  });

  it('deletes filtered remote objects with branch folder', async () => {
    const key = 'latest';
    const data = await deleteRemoteKeys(key, {
      remoteRegion: 'region',
      browser: 'chrome',
      branch: 'branch'
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

    await fetchRemoteKeys(config, key, imageName);
    expect(fs.writeFileSync.mock.calls).toEqual([
      [`mock/resolved/path/${imageName}`, 'buffer obj']
    ]);
  });

  it('uploads to the remote Keys with branch', async () => {
    const keyValue = {
      baseline: 'chrome/default/baseline/mock/resolved/path/file1',
      latest: 'chrome/branch/latest/mock/resolved/path/file1',
      generatedDiffs: 'chrome/branch/generatedDiffs/mock/resolved/path/file1',
      report: 'chrome/branch/report/mock/resolved/path/file1'
    };
    const config = {
      remoteRegion: 'region',
      browser: 'chrome',
      baseline: './e2eTests/baseline',
      latest: './e2eTests/latest',
      generatedDiffs: './e2eTests/generatedDiffs',
      branch: 'branch'
    };
    const file = ['file1'];
    fs.readdirSync.mockReturnValue(file);
    fs.createReadStream.mockReturnValue({
      on: () => {}
    });
    for (const [key, value] of Object.entries(keyValue)) {
      await uploadRemoteKeys(key, config)
        .then(promises => promises[0])
        .then(obj => obj.Key)
        .then(name => {
          expect(name).toEqual(value);
        });
    }
  });

  it('uploads to the remote Keys without branch', async () => {
    const keyValue = {
      baseline: 'chrome/default/baseline/mock/resolved/path/file1',
      latest: 'chrome/default/latest/mock/resolved/path/file1',
      generatedDiffs: 'chrome/default/generatedDiffs/mock/resolved/path/file1',
      report: 'chrome/default/report/mock/resolved/path/file1'
    };
    const config = {
      remoteRegion: 'region',
      browser: 'chrome',
      baseline: './e2eTests/baseline',
      latest: './e2eTests/latest',
      generatedDiffs: './e2eTests/generatedDiffs',
      branch: 'default'
    };
    const file = ['file1'];
    fs.readdirSync.mockReturnValue(file);
    fs.createReadStream.mockReturnValue({
      on: () => {}
    });
    for (const [key, value] of Object.entries(keyValue)) {
      await uploadRemoteKeys(key, config)
        .then(promises => promises[0])
        .then(obj => obj.Key)
        .then(name => {
          expect(name).toEqual(value);
        });
    }
  });

  it('archives the remote Keys', async () => {
    const mockedDate = new Date(2017, 11, 10);
    global.Date = jest.fn(() => mockedDate);
    const keyValue = {
      baseline:
        'chrome/default/archive/Sun Dec 10 2017 00:00:00 GMT+0000 (Greenwich Mean Time)/baseline/mock/resolved/path/file1'
    };

    const config = {
      remoteRegion: 'region',
      browser: 'chrome',
      baseline: './e2eTests/baseline',
      latest: './e2eTests/latest',
      generatedDiffs: './e2eTests/generatedDiffs',
      branch: 'default'
    };
    const file = ['file1'];
    fs.readdirSync.mockReturnValue(file);
    fs.createReadStream.mockReturnValue({
      on: () => {}
    });
    for (const [key, value] of Object.entries(keyValue)) {
      await archiveRemoteKeys(key, config)
        .then(promises => promises[0])
        .then(obj => obj.Key)
        .then(name => {
          expect(name).toEqual(value);
        });
    }
  });
});
