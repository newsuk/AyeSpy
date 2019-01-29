import logger from './logger';

class Reporter {
  constructor() {
    this._state = {
      passed: {
        count: 0,
        scenarios: []
      },
      failed: {
        count: 0,
        scenarios: []
      }
    };
  }

  get state() {
    return this._state;
  }

  pass(scenarioName) {
    if (!scenarioName) throw 'No scenario name reported';
    this.state.passed.scenarios.push(scenarioName);
    this.state.passed.count++;
  }

  fail(scenarioName) {
    if (!scenarioName) throw 'No scenario name reported';
    this.state.failed.scenarios.push(scenarioName);
    this.state.failed.count++;
  }

  generateReport() {
    logger.info(
      'Reporter',
      `
      AyeSpy
---------------------

Scenarios Passed: ${this.state.passed.count}
Scenarios Failed: ${this.state.failed.count}

---------------------
`
    );

    if (this.state.failed.count > 0) {
      logger.info('Reporter', 'Failed Scenarios:');
      this.state.failed.scenarios.forEach(scenario =>
        logger.info('Reporter', scenario)
      );
    }
  }
}

export default Reporter;
