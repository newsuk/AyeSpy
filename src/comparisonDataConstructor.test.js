/* globals jest expect */

import comparisonDataConstructor from './comparisonDataConstructor';

describe('data constructor', () => {
  let mockFs;

  beforeEach(() => {
    mockFs = {
      access: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('if file paths both exist then it should return the correct data format', async () => {
    const config = {
      latest: 'testLatest',
      baseline: 'testBaseline',
      generatedDiffs: 'testDiff',
      scenarios: [
        {
          label: 'test1'
        }
      ]
    };

    mockFs.access.mockReturnValue(true);

    const data = await comparisonDataConstructor(mockFs, config);

    const expectedData = [
      {
        label: 'test1',
        baseline: 'testBaseline/test1.png',
        latest: 'testLatest/test1.png',
        generatedDiffs: 'testDiff/test1.png',
        tolerance: 0
      }
    ];

    expect(data).toEqual(expectedData);
  });

  it('if files paths are not present then it should exit', async () => {
    const configs = [
      {
        baseline: 'testBaseline',
        scenarios: [
          {
            label: 'one'
          }
        ]
      },
      {
        latest: 'testLatest',
        scenarios: [
          {
            label: 'two'
          }
        ]
      }
    ];

    mockFs.access
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    global.process.exit = jest.fn();

    configs.forEach(
      async config => await comparisonDataConstructor(mockFs, config)
    );

    expect(global.process.exit.mock.calls).toEqual([[1], [1]]);
  });
});
