import { isLocalConfigValid,isRemoteConfigValid } from './configValidator';

describe('The Config Validator', () => {
  it('local config returns false for invalid configs', () => {
    const config = {
      gridUrl: 'http://selenium.com:4444/wd/hub'
    };
    expect(isLocalConfigValid(config)).toBe(false);
  });

  it('local config returns true for valid configs', () => {
    const config = {
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
    expect(isLocalConfigValid(config)).toBe(true);
  });

  it('remote config returns false for invalid configs', () => {
    const config = {
      gridUrl: 'http://selenium.com:4444/wd/hub'
    };
    expect(isRemoteConfigValid(config)).toBe(false);
  });

  it('remote config returns true for valid configs', () => {
    process.env.AWS_SECRET_ACCESS_KEY = 'test'
    process.env.AWS_ACCESS_KEY_ID = 'test'
    const config = {
      remoteBucketName: 'aye-spy',
      remoteRegion: 'eu-west-1'
    };
    expect(isRemoteConfigValid(config)).toBe(true);
  });
});
