import configValidator from './configValidator';

describe('The Config Validator', () => {
  it('reports missing config fields', () => {
    const config = {
      gridUrl: 'http://selenium.com:4444/wd/hub',
      // baseline: './e2eTests/generateHtmlReport/baseline',
      latest: './e2eTests/generateHtmlReport/latest',
      //generatedDiffs: './e2eTests/generateHtmlReport/generatedDiffs',
      //report: './e2eTests/generateHtmlReport/reports',
      scenarios: [
        {
          url: 'http:/google.com/',
          label: 'homepage'
        }
      ]
    };
    configValidator(config);
  });
});
