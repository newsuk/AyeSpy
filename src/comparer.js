import looksSame from 'looks-same';
import logger from './logger';

const isEqual = imageData =>
  new Promise((resolve, reject) => {
    looksSame(
      imageData.baseline,
      imageData.latest,
      {
        tolerance: imageData.tolerance,
        ignoreCaret: true,
        ignoreAntialiasing: true
      },
      (error, equal) => {
        if (error) {
          logger.error('comparer', error);
          reject(error);
        }

        if (equal) {
          logger.info('comparer', `✅ Passed: ${imageData.label}`);
        } else {
          logger.info('comparer', `☠️ Failed: ${imageData.label}`);
        }

        resolve(equal);
      }
    );
  });

export default isEqual;
