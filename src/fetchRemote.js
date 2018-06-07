import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

export default (config, key, imageName) =>
  new Promise((resolve, reject) => {
    let imageDir;
    if (key === 'latest') imageDir = path.resolve(config.latest);
    if (key === 'baseline') imageDir = path.resolve(config.baseline);
    if (key === 'generatedDiffs')
      imageDir = path.resolve(config.generatedDiffs);

    const remoteFileName = `${config.browser}/${key}/${imageName}`;
    const fileName = `${imageDir}/${imageName}`;
    const s3 = new AWS.S3();
    const params = { Bucket: config.remoteBucketName, Key: remoteFileName };

    s3.getObject(params, (error, data) => {
      if (error) reject(error);
      fs.writeFileSync(fileName, data.Body);
      resolve();
    });
  });
