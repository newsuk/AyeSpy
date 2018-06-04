import fs from 'fs';
import path from 'path';
import logger from './logger';

export default config =>
  new Promise((resolve, reject) => {
    if (!config.baseline) reject('Please define baseline property in config');
    if (!config.latest) reject('Please define baseline property in config');

    const dirPath = path.resolve(config.latest);
    const latestSnaps = fs.readdirSync(dirPath);
    if (latestSnaps.length === 0) throw `No latest snaps found in ${dirPath}`;

    logger.info(
      'update-baseline-shots',
      `Found ${latestSnaps.length} images to copy to baseline directory`
    );

    for (let i = 0; i < latestSnaps.length; i++) {
      const src = path.resolve(dirPath, latestSnaps[i]);
      const destination = path.resolve(config.baseline, latestSnaps[i]);

      fs.access(destination, err => {
        if (err) fs.mkdirSync(config.baseline);
      });

      fs.copyFileSync(src, destination);
    }

    logger.info('update-baseline-shots', 'Baseline directory updated');

    resolve();
  });
