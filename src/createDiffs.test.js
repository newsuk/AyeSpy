/* globals jest jasmine expect */
import createDiffImage from './createDiffs';

jest.mock('path');

const comparisonData = {
  label: 'test1-large',
  baseline: 'testBaseline/test1-large.png',
  latest: 'testLatest/test1-large.png',
  generatedDiffs: 'testDiff/test1-large.png',
  tolerance: 0
};

describe('Creating difference images', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('rejects if creating the image errors', () => {
    const createDiff = jest.fn().mockImplementation((_, callback) => {
      callback('ERR');
    });

    return expect(createDiffImage(comparisonData, createDiff)).rejects.toBe(
      'ERR'
    );
  });

  it('checks whether the image data looks the same', () => {
    const createDiff = jest.fn().mockImplementation((_, callback) => {
      callback(null);
    });

    const expectedArgument = {
      current: 'testLatest/test1-large.png',
      diff: 'mock/resolved/path',
      highlightColor: '#ff00ff',
      reference: 'testBaseline/test1-large.png',
      strict: false,
      tolerance: 0
    };

    return createDiffImage(comparisonData, createDiff).then(() => {
      expect(createDiff).toHaveBeenCalledWith(
        expectedArgument,
        jasmine.any(Function)
      );
    });
  });
});
