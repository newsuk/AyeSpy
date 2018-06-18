/* globals jest expect */

import {
  createDirectories,
  fetchRemoteComparisonImages
} from './comparisonActions';
import { deleteRemote, fetchRemote } from './remoteActions';

jest.mock('fs');
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

  it('deletes generated differences from the remote buckect before fetching baseline images', async () => {
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

    await fetchRemoteComparisonImages(mockFs, config).catch(err =>
      console.log(err)
    );
    expect(deleteRemote.mock.calls.length).toBe(1);
    expect(fetchRemote.mock.calls.length).toBe(2);
  });
});
