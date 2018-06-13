import path from 'path';
import deleteRemote from './deleteRemote';
import fetchRemote from './fetchRemote';
import createDiffImage from './createDiffs';
import comparisonDataConstructor from './comparisonDataConstructor';
import isEqual from './comparer';
import uploadRemote from './uploadRemote';

const createComparisons = async (fs, config) => {
  const comparisonData = await comparisonDataConstructor(fs, config);

  for (let i = 0; i < comparisonData.length; i++) {
    if (!(await isEqual(comparisonData[i]))) {
      await createDiffImage(comparisonData[i]);
    }
  }

  if (config.remote) await uploadRemote('generatedDiffs', config);
};

const createDirectories = (fs, config) =>
  new Promise(resolve => {
    const directories = [];
    directories.push(config.latest, config.generatedDiffs, config.baseline);

    directories.forEach(dir => {
      fs.access(path.resolve(dir), err => {
        if (err) {
          fs.mkdirSync(path.resolve(dir));
        }
      });
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
      await fetchRemote(config, 'baseline', `${config.scenarios[i].label}.png`);
    }
  }
};

export {
  createComparisons,
  createDirectories,
  clearDirectory,
  fetchRemoteComparisonImages
};
