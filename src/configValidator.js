import logger from './logger';

const mandatoryLocalFields = [
  'gridUrl',
  'baseline',
  'latest',
  'generatedDiffs',
  'report',
  'scenarios',
  'browser'
];
const mandatoryRemoteFields = [
  'remoteBucketName',
  'remoteRegion',
  'remoteBucketAccess'
];

function isValid(missingConfigFields) {
  if (missingConfigFields.length > 0) {
    logger.info(
      'configValidator',
      `❗️  Please add missing mandatory fields to your config: \n${missingConfigFields.toString()}`
    );
    return false;
  }

  return true;
}

function isRemoteConfigValid(config) {
  const missingConfigFields = mandatoryRemoteFields.filter(
    field => !config[field]
  );

  return isValid(missingConfigFields);
}

function isLocalConfigValid(config) {
  const missingConfigFields = mandatoryLocalFields.filter(
    field => !config[field]
  );

  return isValid(missingConfigFields);
}

function isMobileConfigValid(config) {
  let isMobileConfigCorrect = true;

  config.scenarios.forEach(scenario => {
    if (
      config.browser !== 'chrome' &&
      (scenario.mobileDeviceName || scenario.chromeCustomCapabilites)
    ) {
      logger.info(
        'configValidator',
        `❗️  ${
          config.browser
        } not supported on the mobile emulator / custom capabilities. Please change your browser to chrome.`
      );
      isMobileConfigCorrect = false;
    }
  });

  return isMobileConfigCorrect;
}

const validateConfig = (config, isRemote) =>
  new Promise(resolve => {
    let isRemoteConfigCorrect = true;

    if (isRemote) {
      isRemoteConfigCorrect = isRemoteConfigValid(config);
    }
    if (
      isLocalConfigValid(config) &&
      isRemoteConfigCorrect &&
      isMobileConfigValid(config)
    ) {
      logger.info('configValidator', 'Config validated ✅');
      resolve();
    } else {
      logger.info('configValidator', 'Exiting Aye Spy');
      process.exitCode = 1;
      process.exit();
    }
  });

export default validateConfig;
export { isLocalConfigValid, isRemoteConfigValid, isMobileConfigValid };
