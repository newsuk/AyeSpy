/* globals jest expect */

import comparisonDataConstructor from './comparisonDataConstructor';

describe('data constructor', () => {
  let mockFs;

  beforeEach(() => {
    mockFs = {
      existsSync: jest.fn()
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
          viewports: [{"height": 2400, "width": 1024, "label": "large"}],
          label: 'test1'
        }
      ]
    };

    mockFs.existsSync.mockReturnValue(true);

    const data = await comparisonDataConstructor(mockFs, config);

    const expectedData = [
      {
        label: 'test1-large',
        baseline: 'testBaseline/test1-large.png',
        latest: 'testLatest/test1-large.png',
        generatedDiffs: 'testDiff/test1-large.png',
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
            viewports: [{"height": 2400, "width": 1024, "label": "large"}],            
            label: 'one'
          }
        ]
      },
      {
        latest: 'testLatest',
        scenarios: [
          {
            viewports: [{"height": 2400, "width": 1024, "label": "large"}],            
            label: 'two'
          }
        ]
      }
    ];

    mockFs.existsSync.mockReturnValue(false);

    global.process.exit = jest.fn();

    configs.forEach(
      async config => await comparisonDataConstructor(mockFs, config)
    );

    expect(global.process.exit.mock.calls).toEqual([[1], [1]]);
  });
});
