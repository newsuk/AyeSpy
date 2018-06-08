import AWS from 'aws-sdk';
import path from 'path';
import listRemote from './listRemote';
import logger from './logger';

export default async (key, config) => {
  const filteredResults = await listRemote(key, config);

  new Promise((resolve, reject) => {
    AWS.config.update({ region: config.remoteRegion });
    const s3 = new AWS.S3();

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

    for (let i = 0; i < filteredResults.length; i++) {
      const keyObject = { Key: filteredResults[i].Key };
      params.Delete.Objects.push(keyObject);
    }

    s3.deleteObjects(params, (error, data) => {
      if (error) reject(error);
      logger.info('delete-remote', `Successfully deleted ${key}`);
      resolve(data);
    });
  });
};
