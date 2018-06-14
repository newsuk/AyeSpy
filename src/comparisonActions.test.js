/* globals jest expect */

import { createDirectories } from './comparisonActions';

jest.mock('fs');

describe('The comparions actions', () => {
  let mockFs;

  beforeEach(() => {
    mockFs = {
      readdirSync: () => ['1', '2', '3', '4', '5', '6'],
      existsSync: jest.fn(),
      mkdirSync: () => {},
      copyFileSync: () => {}
    };
  });

  it('Creates directories checks the directories exist before creating', async () => {
    const config = {
      baseline: './baselineTest',
      latest: './latestTest',
      generatedDiffs: './generatedDiffsTest'
    };

    await createDirectories(mockFs, config).catch(err => console.log(err));
    expect(mockFs.existsSync.mock.calls.length).toBe(3);
  });

  it('Creates directories for diff, latest and baseline', async () => {
    mockFs = {
      existsSync: () => false,
      mkdirSync: jest.fn()
    };

    const config = {
      baseline: './baselineTest',
      latest: './latestTest',
      generatedDiffs: './generatedDiffsTest'
    };

    await createDirectories(mockFs, config).catch(err => console.log(err));
    expect(mockFs.mkdirSync.mock.calls.length).toBe(3);
  });
});
