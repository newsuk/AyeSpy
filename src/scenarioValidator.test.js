/* globals expect */
import scenarioValidator from './scenarioValidator';

describe('Validate Scenario', () => {
  it('Valid Scenario', () => {
    const scenario = {
      url: 'http://lol.co.uk/',
      label: 'scenario-valid-viewport',
      viewports: [{ width: 1024, height: 800, label: 'large' }]
    };

    expect(() => scenarioValidator(scenario)).not.toThrow();
  });
  it('Scenario missing height', () => {
    const scenario = {
      url: 'http://lol.co.uk/',
      label: 'scenario-height-missing',
      viewports: [{ width: 1024, label: 'large' }]
    };
    expect(() => scenarioValidator(scenario)).toThrow(
      'scenario-height-missing has no height set'
    );
  });

  it('Scenario missing width', () => {
    const scenario = {
      url: 'http://lol.co.uk/',
      label: 'scenario-width-missing',
      viewports: [{ height: 1024, label: 'large' }]
    };

    expect(() => scenarioValidator(scenario)).toThrow(
      'scenario-width-missing has no width set'
    );
  });

  it('Scenario missing label', () => {
    const scenario = {
      url: 'http://lol.co.uk/',
      label: 'scenario-label-missing',
      viewports: [{ height: 1024, width: 800 }]
    };

    expect(() => scenarioValidator(scenario)).toThrow(
      'scenario-label-missing has no label set'
    );
  });

  it('Scenario missing viewport', () => {
    const scenario = {
      url: 'http://lol.co.uk/',
      label: 'scenario-viewport-missing'
    };

    expect(() => scenarioValidator(scenario)).toThrow(
      'scenario-viewport-missing has no viewports array defined'
    );
  });
});
