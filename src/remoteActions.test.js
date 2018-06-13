/* globals jest expect */

import { resolveImagePath } from './remoteActions';

jest.mock('path');

describe('Remote interactions', () => {
  it('when passed a vailid key a path is returned', async () => {
    const config = {
      baseline: './e2eTests/baseline',
      latest: './e2eTests/latest',
      generatedDiffs: './e2eTests/generatedDiffs'
    };

    const path = await resolveImagePath('latest', config);
    expect(path).toEqual('resolution');
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
});
