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
        logger.info('comparer', `${imageData.label} is ${equal}`);
        imageData.equal = equal;
        resolve(imageData);
      }
    );
  });

const createDiffImage = imageData => {
  if (!imageData.equal) {
    new Promise((resolve, reject) => {
      looksSame.createDiff(
        {
          reference: imageData.baseline,
          current: imageData.latest,
          diff: `${imageData.diffDirectory}/${imageData.label}.png`,
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
          resolve();
        }
      );
    });
  }
  return imageData;
};

export { compare, createDiffImage };
