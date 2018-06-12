import looksSame from 'looks-same';
import { promisify } from 'util';
import logger from './logger';

const looksSameAsync = promisify(looksSame);

const isEqual = imageData =>
  looksSameAsync(imageData.baseline, imageData.latest, {
    tolerance: imageData.tolerance,
    ignoreCaret: true,
    ignoreAntialiasing: true
  })
    .then(equal => {
      if (equal) {
        logger.info('comparer', `✅ Passed: ${imageData.label}`);
      } else {
        logger.info('comparer', `☠️ Failed: ${imageData.label}`);
      }
      return equal;
    })
    .catch(error => {
      logger.error('comparer', error);
    });

export default isEqual;
