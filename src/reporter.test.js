/* globals expect it */
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
});
