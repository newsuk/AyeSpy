import getSreenshots from './getScreenshots';

const scenarioBuilder = scenariosToGenerate =>
  new Array(scenariosToGenerate).fill(null).map((_, index) => ({
    url: 'http://lol.co.uk/',
    label: `scenario-${index}`,
    viewports: [{ height: 2400, width: 1024, label: 'large' }]
  }));

class MockSnapshotter {
  constructor({ label, viewportLabel }) {
    this.scenarioName = `${label}-${viewportLabel}`;
  }
  takeSnap() {
    console.log('calling - ' + this.scenarioName);
    return Promise.resolve();
  }
}

describe.only('gets Screenshots', () => {
  it('Limits the amount of parallel requests to the grid', () => {
    const config = {
      gridUrl: 'http://selenium-grid:4444/wd/hub',
      baseline: './baseline',
      latest: './latest',
      generatedDiffs: './generatedDiffs',
      report: './reports',
      scenarios: scenarioBuilder(110)
    };

    const requestLimit = 10;
    getSreenshots(MockSnapshotter, config, requestLimit);
  });
});
