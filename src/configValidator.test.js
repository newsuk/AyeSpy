/* globals expect jest */

import validateConfig, {
  isLocalConfigValid,
  isRemoteConfigValid,
  isMobileConfigValid
} from './configValidator';

import logger from './logger';

describe('The Config Validator', () => {
  beforeEach(() => {
    logger.info = jest.fn();
  });

  it('local config returns false for invalid configs', () => {
    const config = {
      gridUrl: 'http://selenium.com:4444/wd/hub'
    };

    expect(isLocalConfigValid(config)).toBe(false);
    const missingFields = logger.info.mock.calls[0][1];
    expect(missingFields).toContain(
      'baseline,latest,generatedDiffs,report,scenarios,browser'
    );
  });

  it('local config returns true for valid configs', () => {
    const config = {
      gridUrl: 'http://selenium.com:4444/wd/hub',
      baseline: './e2eTests/generateHtmlReport/baseline',
      latest: './e2eTests/generateHtmlReport/latest',
      generatedDiffs: './e2eTests/generateHtmlReport/generatedDiffs',
      report: './e2eTests/generateHtmlReport/reports',
      browser: 'chrome',
      scenarios: [
        {
          url: 'http:/google.com/',
          label: 'homepage'
        }
      ]
    };
    expect(isLocalConfigValid(config)).toBe(true);
  });

  it('remote config returns false for invalid configs', () => {
    const config = {
      gridUrl: 'http://selenium.com:4444/wd/hub'
    };
    expect(isRemoteConfigValid(config)).toBe(false);
    const missingFields = logger.info.mock.calls[0][1];
    expect(missingFields).toContain('remoteBucketName,remoteRegion');
  });

  it('remote config returns true for valid configs', () => {
    const config = {
      remoteBucketName: 'aye-spy',
      remoteBucketAccess: 'private',
      remoteRegion: 'eu-west-1'
    };
    expect(isRemoteConfigValid(config)).toBe(true);
  });

  it('exits if the config is invalid', () => {
    const invalidConfig = {
      gridUrl: 'http://selenium.com:4444/wd/hub',
      baseline: './e2eTests/generateHtmlReport/baseline',
      latest: './e2eTests/generateHtmlReport/latest',
      generatedDiffs: './e2eTests/generateHtmlReport/generatedDiffs',
      report: './e2eTests/generateHtmlReport/reports',
      scenarios: [
        {
          url: 'http:/google.com/',
          label: 'homepage'
        }
      ]
    };

    process.exit = jest.fn();
    validateConfig(invalidConfig, true);
    expect(process.exit.mock.calls.length).toBe(1);
  });

  it('resolves a correct config', done => {
    const config = {
      remoteBucketName: 'test',
      remoteBucketAccess: 'public',
      remoteRegion: 'test',
      gridUrl: 'http://selenium.com:4444/wd/hub',
      baseline: './e2eTests/generateHtmlReport/baseline',
      latest: './e2eTests/generateHtmlReport/latest',
      generatedDiffs: './e2eTests/generateHtmlReport/generatedDiffs',
      report: './e2eTests/generateHtmlReport/reports',
      browser: 'chrome',
      scenarios: [{ url: 'http:/google.com/', label: 'homepage' }]
    };
    validateConfig(config, true).then(done);
  });

  it('config returns true for valid mobile configs', () => {
    const config = {
      browser: 'chrome',
      scenarios: [
        {
          url: 'http:/google.com/',
          label: 'homepage',
          mobileDeviceName: 'iPhone 7 Plus'
        }
      ]
    };
    expect(isMobileConfigValid(config)).toBe(true);
  });

  it('config returns true for valid chrome custom capabilities', () => {
    const config = {
      browser: 'chrome',
      scenarios: [
        {
          url: 'http:/google.com/',
          label: 'homepage',
          chromeCustomCapabilites: '{args:["incognito"]}}'
        }
      ]
    };
    expect(isMobileConfigValid(config)).toBe(true);
  });

  it('config returns false for invalid mobile configs', () => {
    const config = {
      browser: 'firefox',
      scenarios: [
        {
          url: 'http:/google.com/',
          label: 'homepage',
          mobileDeviceName: 'iPhone 7 Plus'
        }
      ]
    };
    expect(isMobileConfigValid(config)).toBe(false);
  });

  it('config returns false for invalid custom google capabilities', () => {
    const config = {
      browser: 'firefox',
      scenarios: [
        {
          url: 'http:/google.com/',
          label: 'homepage',
          chromeCustomCapabilites: '{args:["incognito"]}}'
        }
      ]
    };
    expect(isMobileConfigValid(config)).toBe(false);
  });
});
