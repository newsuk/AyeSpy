import logger from './logger';

function isValid(missingConfigFields) {
  if (missingConfigFields.length > 0) {
    logger.info(
      'configValidator',
      `❗️Missing mandatory fields from config: \n${missingConfigFields.toString()}`
    );
    return false;
  }

  return true;
}
function isRemoteConfigValid(config) {
  const missingConfigFields = ['remoteBucketName', 'remoteRegion'].filter(
    field => !config[field]
  );

  if (!process.env.AWS_SECRET_ACCESS_KEY)
    missingConfigFields.push('env variable AWS_SECRET_ACCESS_KEY');
  if (!process.env.AWS_ACCESS_KEY_ID)
    missingConfigFields.push('env variable AWS_ACCESS_KEY_ID');

  return isValid(missingConfigFields);
}
function isLocalConfigValid(config) {
  const missingConfigFields = [
    'gridUrl',
    'baseline',
    'latest',
    'generatedDiffs',
    'report',
    'scenarios'
  ].filter(field => !config[field]);

  return isValid(missingConfigFields);
}

const validateConfig = (config, isRemote) => {
  if (isRemote) isRemoteConfigValid(config);

  isLocalConfigValid(config);
};

export default validateConfig;
export { isLocalConfigValid, isRemoteConfigValid };
