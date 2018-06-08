import AWS from 'aws-sdk';

export default (key, config) =>
  new Promise((resolve, reject) => {
    AWS.config.update({ region: config.remoteRegion });
    const s3 = new AWS.S3();
    const params = { Bucket: config.remoteBucketName };

    s3.listObjectsV2(params, (error, data) => {
      if (error) reject(error);

      const filteredResults = data.Contents.filter(item =>
        item.Key.includes(`${config.browser}/${key}`)
      );
      resolve(filteredResults);
    });
  });
