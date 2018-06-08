import AWS from 'aws-sdk';
import path from 'path';

export default (key, config) =>
  new Promise((resolve, reject) => {
    AWS.config.update({ region: config.remoteRegion });
    const s3 = AWS.S3();

    let imageDir;
    if (key === 'latest') imageDir = path.resolve(config.latest);
    if (key === 'baseline') imageDir = path.resolve(config.baseline);
    if (key === 'generatedDiffs')
      imageDir = path.resolve(config.generatedDiffs);
    if (!imageDir) reject('The key did not match any of the available options');

    var params = {
      Bucket: config.remoteBucketName,
      Delete: {
        Objects: [],
        Quiet: false
      }
    };

    s3.deleteObjects(params, error => {
      if (error) reject(error);
    });
    resolve();
  });
