/* globals expect jest */
import getScreenshots from './getScreenshots';
import { executeScript } from './executeScript';

jest.mock('./executeScript');

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

    return getScreenshots(MockSnapshotter, config).then(() => {
      return expect(callCount).toBe(scenariosAndViewports);
    });
  });

  it('limits the amount of scenarios to execute at one time', () => {
    const assertString = 'I am called';
    class MockSnapshotter {
      takeSnap() {
        return assertString;
      }
    }

    Promise.all = jest.fn().mockImplementation(() => Promise.resolve());

    const scenarioCount = 6;
    const config = {
      gridUrl: 'http://selenium-grid:4444/wd/hub',
      baseline: './baseline',
      latest: './latest',
      generatedDiffs: './generatedDiffs',
      report: './reports',
      scenarios: scenarioBuilder(scenarioCount),
      limitAmountOfParallelScenarios: 2
    };

    return getScreenshots(MockSnapshotter, config).then(() => {
      return expect(Promise.all.mock.calls[0]).toEqual([
        [assertString, assertString]
      ]);
    });
  });

  it('Runs the onBeforeSuiteScript once before all scenarios', () => {
    class MockSnapshotter {
      takeSnap() {
        return jest.fn().mockImplementation(() => Promise.resolve());
      }
    }
    const executeScriptMock = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    executeScript.mockImplementation(executeScriptMock);

    const scenarioCount = 5;
    const config = {
      gridUrl: 'http://selenium-grid:4444/wd/hub',
      baseline: './baseline',
      latest: './latest',
      generatedDiffs: './generatedDiffs',
      report: './reports',
      scenarios: scenarioBuilder(scenarioCount),
      onBeforeSuiteScript: './src/__mocks__/onBeforeSuiteMock.js'
    };

    return getScreenshots(MockSnapshotter, config).then(() => {
      return expect(executeScriptMock).toHaveBeenCalledTimes(1);
    });
  });

  it.only('throws an error if the On BeforeSuiteScript fails to run', () => {
    class MockSnapshotter {
      takeSnap() {
        return jest.fn().mockImplementation(() => Promise.resolve());
      }
    }

    executeScript.mockImplementation(() => Promise.reject());

    const scenarioCount = 5;
    const config = {
      gridUrl: 'http://selenium-grid:4444/wd/hub',
      baseline: './baseline',
      latest: './latest',
      generatedDiffs: './generatedDiffs',
      report: './reports',
      scenarios: scenarioBuilder(scenarioCount),
      onBeforeSuiteScript: './src/__mocks__/onBeforeSuiteMock.js'
    };

    return expect(getScreenshots(MockSnapshotter, config)).rejects.toThrow();
  });
});
