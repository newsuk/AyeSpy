/* globals jest describe it expect */

import updateBaselineShots from './updateBaselineShots';

describe('update baseline shots', () => {
  let mockFs;

  beforeEach(() => {
    mockFs = {
      readdirSync: () => ['1', '2', '3', '4', '5', '6'],
      access: () => {},
      mkdirSync: () => {},
      copyFileSync: jest.fn()
    };
  });

  it('copies src files to destination for all files', async () => {
    const config = {
      baseline: 'baseline',
      latest: 'latest'
    };

    await updateBaselineShots(mockFs, config).catch(err => console.log(err));
    expect(mockFs.copyFileSync.mock.calls.length).toBe(6);
  });

  it('rejects if baseline is not specified', () => {
    const config = {
      latest: 'latest'
    };

    expect(updateBaselineShots(mockFs, config)).rejects.toBe(
      'Please define baseline property in config'
    );
  });

  it('rejects if latest is not defined', () => {
    const config = {
      baseline: 'baseline'
    };

    expect(updateBaselineShots(mockFs, config)).rejects.toBe(
      'Please define latest snapshot property in config'
    );
  });

  it('rejects if no images are found in latest snapshot directory', async () => {
    const config = {
      baseline: 'baseline',
      latest: 'latest'
    };
    mockFs.readdirSync = () => [];

    await updateBaselineShots(mockFs, config).catch(err => {
      expect(err).toContain(config.latest);
    });
  });
});
