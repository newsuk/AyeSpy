/* globals expect jest it */
import Reporter from './reporter';
import logger from './logger';

jest.mock('./logger');

describe('Test reporter', () => {
  let reporter;

  beforeEach(() => {
    jest.clearAllMocks();
    reporter = new Reporter();
  });

  it('increments on a passed test:', () => {
    reporter.pass('test');
    expect(reporter.state.passed.count).toBe(1);
  });

  it('throws without passed scenario name', () => {
    expect(() => reporter.pass()).toThrow();
  });

  it('increments on a failed test', () => {
    reporter.fail('fail');
    expect(reporter.state.failed.count).toBe(1);
  });

  it('throws without failed scenario name', () => {
    expect(() => reporter.fail()).toThrow();
  });

  it('reports for each failure', () => {
    reporter.fail('1');
    reporter.fail('2');
    reporter.generateReport();

    expect(logger.info).toBeCalledTimes(4);
  });

  it('reports if there are no failures', () => {
    reporter.pass('1');
    reporter.pass('2');
    reporter.generateReport();

    expect(logger.info).toBeCalledTimes(1);
  });
});
