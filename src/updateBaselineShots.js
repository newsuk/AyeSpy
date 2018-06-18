import path from 'path';
import logger from './logger';

export default (fs, config) =>
  new Promise((resolve, reject) => {
    if (!config.baseline) reject('Please define baseline property in config');
    if (!config.latest)
      reject('Please define latest snapshot property in config');

    const dirPath = path.resolve(config.latest);
    const latestSnaps = fs.readdirSync(dirPath);
    if (latestSnaps.length === 0) reject(`No latest snaps found in ${dirPath}`);

    logger.info(
      'update-baseline-shots',
      `Found ${latestSnaps.length} images to copy to baseline directory`
    );

    for (let i = 0; i < latestSnaps.length; i++) {
      const isPng = latestSnaps[i].split('.').pop() === 'png';
      if (isPng) {
        const src = path.resolve(dirPath, latestSnaps[i]);
        const destination = path.resolve(config.baseline, latestSnaps[i]);

        fs.copyFileSync(src, destination);
      }
    }

    logger.info('update-baseline-shots', 'Baseline directory updated');

    resolve();
  });
