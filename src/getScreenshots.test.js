/* globals expect jest */
import getSreenshots from './getScreenshots';

const scenarioBuilder = scenariosToGenerate =>
  new Array(scenariosToGenerate).fill(null).map((_, index) => ({
    url: 'http://lol.co.uk/',
    label: `scenario-${index}`,
    viewports: [
      { height: 2400, width: 1024, label: 'large' },
      { height: 2400, width: 14, label: 'small' }
    ]
  }));

describe('gets Screenshots', () => {
  it('queues up the expected number of snapshots', () => {
    let callCount = 0;
    class MockSnapshotter {
      takeSnap() {
        callCount++;
        return jest.fn().mockImplementation(() => Promise.resolve());
      }
    }

    const scenarioCount = 22;
    const config = {
      gridUrl: 'http://selenium-grid:4444/wd/hub',
      baseline: './baseline',
      latest: './latest',
      generatedDiffs: './generatedDiffs',
      report: './reports',
      scenarios: scenarioBuilder(scenarioCount)
    };

    const scenariosAndViewports =
      scenarioCount * config.scenarios[0].viewports.length;

    return getSreenshots(MockSnapshotter, config).then(() => {
      return expect(callCount).toBe(scenariosAndViewports);
    });
  });
});
