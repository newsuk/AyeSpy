import logger from './logger';

function isLocalConfigValid(config) {
  const mandatoryFields = [
    'gridUrl',
    'baseline',
    'latest',
    'generatedDiffs',
    'report',
    'scenarios'
  ];

  const missingConfigFields = mandatoryFields.filter(field => !config[field]);

  if (missingConfigFields) {
    logger.info(
      'configValidator',
      `❗️Missing mandatory fields from config: \n${missingConfigFields.toString()}`
    );
    return false;
  }

  return true;
}

const validateConfig = (config, isRemote) => {
  isLocalConfigValid(config);
};

export default validateConfig;
