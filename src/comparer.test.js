/* globals jest expect */

import comparer from './comparer';
import logger from './logger';

describe('Comparison of two images', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('when images are the same, comparer resolves as equal', () => {
    const isEqual = () => Promise.resolve(true);
    const imageData = {
      baseline: 'test',
      latest: 'test',
      tolerance: ''
    };

    return expect(comparer(imageData, isEqual)).resolves.toBe(true);
  });

  it('when images are different, comparer resolves as not equal', async () => {
    const isEqual = () => Promise.resolve(false);
    const imageData = {
      baseline: '',
      latest: 'test',
      tolerance: ''
    };

    return expect(comparer(imageData, isEqual)).resolves.toBe(false);
  });

  it('logs error if comparison errors', async () => {
    const isEqual = () => Promise.reject('Err');
    logger.error = jest.fn();

    return comparer({}, isEqual).then(() => {
      expect(logger.error).toBeCalled();
    });
  });
});
