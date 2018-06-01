import looksSame from 'looks-same';
import path from 'path';
import logger from '../logger';

const createDiffImage = imageData => {
  new Promise((resolve, reject) => {
    console.log(imageData);
    looksSame.createDiff(
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
            'comparer',
            '☠️   Something has gone horribly wrong generating the diff image   ☠️'
          );
          logger.error('comparer', error);
          reject(error);
        }
        logger.info('comprer', 'Image differences have been generated!');
        resolve(imageData);
      }
    );
  });
};

export default createDiffImage;
