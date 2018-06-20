/* globals jest expect */

import looksSame from 'looks-same';
import createDiffImage from './createDiffs';

jest.mock('looks-same', () => {
  return { createDiff: jest.fn() };
});

jest.mock('path');

describe('Creating difference images', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('checks whether the image data looks the same', () => {
    jest.setTimeout(60000);
    const comparisonData = {
      label: 'test1-large',
      baseline: 'testBaseline/test1-large.png',
      latest: 'testLatest/test1-large.png',
      generatedDiffs: 'testDiff/test1-large.png',
      tolerance: 0
    };

    createDiffImage(comparisonData);
    expect(looksSame.createDiff).toHaveBeenCalled();
  });
});
