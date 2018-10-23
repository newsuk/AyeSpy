/* globals jest expect */

import filterScenario from './scenarioFilter';

describe('Scenario filter', () => {
  it('Filters scenario correctly', () => {
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

    filterScenario(config, 'test').then(scenario => {
      expect(scenario.length).toBe(1);
    });
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
    process.exit = jest.fn();
    filterScenario(config, 'lol');
    expect(process.exit.mock.calls.length).toBe(1);
  });
});
