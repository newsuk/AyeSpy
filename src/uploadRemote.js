import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import logger from './logger';

export default (key, config) =>
  new Promise((resolve, reject) => {
    if (!key) reject('key must be defined');
    logger.info('upload-remote', 'Uploading to S3');

    let imageDir;
    if (key === 'latest') imageDir = path.resolve(config.latest);
    if (key === 'baseline') imageDir = path.resolve(config.baseline);
    if (key === 'generatedDiffs')
      imageDir = path.resolve(config.generatedDiffs);
    if (key === 'report') imageDir = path.resolve(config.report);
    if (!imageDir) reject('The key did not match any of the available options');

    AWS.config.update({
      region: config.remoteRegion
    });
    const s3 = new AWS.S3();
    const files = fs.readdirSync(imageDir).map(file => `${imageDir}/${file}`);

    if (files.length !== 0) {
      if (!key) reject('No Key specified! 🔑');

      logger.info('upload-remote', `${files.length} images to be uploaded`);
      logger.info('upload-remote', `Images to be sent to bucket key: ${key}`);

      files.forEach(file => {
        const fileStream = fs.createReadStream(file);

        fileStream.on('error', err => {
          logger.error('upload-remote', err);
        });

        const contentType = key === 'report' ? 'text/html' : 'image/png';

        const uploadParams = {
          Bucket: config.remoteBucketName,
          Key: `${config.browser}/${key}/${path.basename(file)}`,
          Body: fileStream,
          ContentType: contentType
        };

        s3.putObject(uploadParams, (err, data) => {
          if (err) {
            logger.error(
              'upload-remote',
              `${path.basename(file)} : ❌  ${err}`
            );
          }
          if (data) {
            logger.info('upload-remote', `${path.basename(file)} : ✅`);
          }
        });
      });
    } else {
      logger.info('upload-remote', 'No snapshots found - skipping');
    }
    resolve();
  });
