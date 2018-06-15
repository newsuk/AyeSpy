import path from 'path';
import {
  createRemote,
  deleteRemote,
  fetchRemote,
  uploadRemote
} from './remoteActions';
import createDiffImage from './createDiffs';
import comparisonDataConstructor from './comparisonDataConstructor';
import isEqual from './comparer';
import Reporter from './reporter';
import logger from './logger';

const createBucket = async config => {
  if (config.remote) {
    await createRemote(config)
      .then(() => {
        logger.info(
          'comparison-actions',
          `${config.remoteBucketName} bucket has been created`
        );
      })
      .catch(() => {
        logger.info('comparison-actions', 'Bucket already created');
      });
  }
};

const createComparisons = async (fs, config) => {
  const comparisonData = await comparisonDataConstructor(fs, config);

  const reporter = new Reporter();

  for (let i = 0; i < comparisonData.length; i++) {
    const scenario = comparisonData[i];
    const equal = await isEqual(scenario);

    if (equal) {
      reporter.pass(scenario.label);
    } else {
      reporter.fail(scenario.label);
      await createDiffImage(scenario);
    }
  }

  if (config.remote)
    await uploadRemote('generatedDiffs', config)
      .then(() =>
        logger.info('upload-remote', 'Files uploaded successfully ✅')
      )
      .catch(error =>
        logger.error('upload-remote', `Error uploading files ❌  ${error}`)
      );

  reporter.exit();
};

const createDirectories = (fs, config) =>
  new Promise(resolve => {
    const directories = [];
    directories.push(config.latest, config.generatedDiffs, config.baseline);

    directories.forEach(dir => {
      const directoryExists = fs.existsSync(dir) ? true : false;

      if (!directoryExists) fs.mkdirSync(dir);
    });

    resolve();
  });

const clearDirectory = (fs, config) => {
  const diffsPath = path.resolve(config.generatedDiffs);
  fs.readdirSync(diffsPath).forEach(file => {
    fs.unlinkSync(`${diffsPath}/${file}`);
  });
};

const fetchRemoteComparisonImages = async (key, config) => {
  if (config.remote) {
    await deleteRemote('generatedDiffs', config);
    for (let i = 0; i < config.scenarios.length; i++) {
      for (let j = 0; j < config.scenarios[i].viewports.length; j++) {
        await fetchRemote(
          config,
          'baseline',
          `${config.scenarios[i].label}-${
            config.scenarios[i].viewports[j].label
          }.png`
        );
      }
    }
  }
};

export {
  createBucket,
  createComparisons,
  createDirectories,
  clearDirectory,
  fetchRemoteComparisonImages
};
