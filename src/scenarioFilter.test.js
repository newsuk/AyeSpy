/* globals expect */

import filterScenario from './scenarioFilter';

describe('Scenario filter', () => {
  it('Filters to a scenario correctly', () => {
    const config = {
      gridUrl: 'http://selenium.com:4444/wd/hub',
      scenarios: [
        {
          url: 'http:/google.com/',
          label: 'homepage'
        },
        {
          url: 'http://test.com',
          label: 'test'
        }
      ]
    };

    expect(filterScenario(config, 'test')[0]).toEqual(config.scenarios[1]);
  });

  it('Throws an error if scenario is not found', () => {
    const config = {
      gridUrl: 'http://selenium.com:4444/wd/hub',
      scenarios: [
        {
          url: 'http:/google.com/',
          label: 'homepage'
        },
        {
          url: 'http://test.com',
          label: 'test'
        }
      ]
    };

    expect(() => filterScenario(config, 'lol')).toThrow();
  });
});
