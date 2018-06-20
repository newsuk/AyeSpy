/* globals jest jasmine expect */

import { createDiff } from 'looks-same';
import createDiffImage from './createDiffs';

jest.mock('looks-same');
jest.mock('path');

describe('Creating difference images', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('checks whether the image data looks the same', async () => {
    const comparisonData = {
      label: 'test1-large',
      baseline: 'testBaseline/test1-large.png',
      latest: 'testLatest/test1-large.png',
      generatedDiffs: 'testDiff/test1-large.png',
      tolerance: 0
    };

    const expectedArgument = {
      current: 'testLatest/test1-large.png',
      diff: 'mock/resolved/path',
      highlightColor: '#ff00ff',
      reference: 'testBaseline/test1-large.png',
      strict: false,
      tolerance: 0
    };

    await createDiffImage(comparisonData);
    expect(createDiff).toHaveBeenCalledWith(
      expectedArgument,
      jasmine.any(Function)
    );
  });
});
