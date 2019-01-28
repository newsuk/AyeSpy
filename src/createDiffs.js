import path from 'path';
import logger from './logger';

const createDiffImage = (imageData, createDiff) =>
  new Promise((resolve, reject) => {
    createDiff(
      {
        reference: imageData.baseline,
        current: imageData.latest,
        diff: `${path.resolve(imageData.generatedDiffs)}`,
        highlightColor: '#ff00ff', //color to highlight the differences
        strict: false, //strict comparsion
        tolerance: imageData.tolerance
      },
      error => {
        if (error) {
          logger.error(
            'createDiffs',
            '☠️   Something has gone horribly wrong generating the diff image   ☠️'
          );
          logger.error('createDiffs', error);
          reject(error);
        }

        logger.verbose('createDiffs', `Diff generated for ${imageData.label}`);
        resolve();
      }
    );
  });

export default createDiffImage;
