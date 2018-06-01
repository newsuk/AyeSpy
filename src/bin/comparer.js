import looksSame from 'looks-same';
import logger from '../logger';

const compare = imageData =>
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
        logger.info(
          'comparer',
          `${imageData.label} comparison status is: ${equal}`
        );
        imageData.equal = equal;
        resolve(imageData);
      }
    );
  });

export default compare;
