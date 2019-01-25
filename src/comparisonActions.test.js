/* globals jest jasmine expect */

import {
  createDirectories,
  fetchRemoteComparisonImages,
  clearDirectories,
  createComparisons,
  createBucket
} from './comparisonActions';
import {
  deleteRemoteKeys,
  fetchRemoteKeys,
  createRemote
} from './remoteActions';
import createDiffImage from './createDiffs';

jest.mock('fs');
jest.mock('./comparisonDataConstructor');
jest.mock('./comparer');
jest.mock('./createDiffs');
jest.mock('./remoteActions');

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

  afterEach(() => {
    jest.clearAllMocks();
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

  it('deletes generated differences from the remote bucket and gets each image', async () => {
    const config = {
      baseline: './baselineTest',
      latest: './latestTest',
      generatedDiffs: './generatedDiffsTest',
      remote: 'yes',
      scenarios: [
        {
          viewports: [
            { height: 2400, width: 1024, label: 'large' },
            { height: 2400, width: 500, label: 'mobile' }
          ],
          label: 'test1'
        }
      ]
    };

    await fetchRemoteComparisonImages(config);
    expect(deleteRemoteKeys.mock.calls.length).toBe(1);
    expect(fetchRemoteKeys.mock.calls.length).toBe(2);
  });

  it('clears the directories', async () => {
    mockFs = {
      readdirSync: () => ['1', '2', '3', '4', '5', '6'],
      unlinkSync: jest.fn(),
      existsSync: () => true
    };

    const config = {
      report: './report',
      baseline: './baselineTest',
      latest: './latestTest',
      generatedDiffs: './generatedDiffsTest'
    };

    await clearDirectories(mockFs, config);
    expect(mockFs.unlinkSync.mock.calls.length).toBe(12);
  });

  it('creates a diff image when comparison fails', async () => {
    class StubReporter {
      get state() {}
      pass() {}
      fail() {}
      generateReport() {}
    }

    const config = {
      baseline: './baselineTest',
      latest: './latestTest',
      generatedDiffs: './generatedDiffsTest',
      scenarios: [
        {
          viewports: [{ height: 2400, width: 1024, label: 'large' }],
          label: 'test1'
        }
      ]
    };
    const expectedArgument = {
      label: 'test1-large',
      baseline: 'testBaseline/test1-large.png',
      latest: 'testLatest/test1-large.png',
      generatedDiffs: 'testDiff/test1-large.png',
      tolerance: 0
    };

    mockFs = {
      readdirSync: () => ['1', '2', '3', '4', '5', '6'],
      unlinkSync: jest.fn()
    };

    await createComparisons(mockFs, config, new StubReporter());
    expect(createDiffImage).toHaveBeenCalledWith(
      expectedArgument,
      jasmine.any(Function)
    );
  });

  it('creates a remote bucket', async () => {
    const config = {
      baseline: './baselineTest',
      latest: './latestTest',
      generatedDiffs: './generatedDiffsTest',
      remote: 'yes'
    };

    await createBucket(config);
    expect(createRemote).toHaveBeenCalledWith(config);
  });
});
