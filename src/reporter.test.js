/* globals expect jest it */
import Reporter from './reporter';

describe('Test reporter', () => {
  let reporter;

  beforeEach(() => {
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

  it('exits with code 1 when there is a failure', () => {
    global.process.exit = jest.fn();

    reporter.fail('fail');
    reporter.exit();
    expect(global.process.exit).toBeCalledWith(1);
  });

  it('exits with code 0 when there is no failures', () => {
    global.process.exit = jest.fn();

    reporter.pass('test');
    reporter.exit();
    expect(global.process.exit).toBeCalledWith(0);
  });
});
