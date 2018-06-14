import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import logger from './logger';

const resolveImagePath = (key, config) =>
  new Promise((resolve, reject) => {
    if (key === 'latest') resolve(path.resolve(config.latest));
    if (key === 'baseline') resolve(path.resolve(config.baseline));
    if (key === 'generatedDiffs') resolve(path.resolve(config.generatedDiffs));
    if (key === 'report') resolve(path.resolve(config.report));
    reject('The key did not match any of the available options');
  });

const deleteRemote = (key, config) =>
  new Promise(async (resolve, reject) => {
    const filteredResults = await listRemote(key, config);

    AWS.config.update({ region: config.remoteRegion });
    const s3 = new AWS.S3();

    const params = {
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

    if (filteredResults.length != 0) {
      s3.deleteObjects(params, (error, data) => {
        if (error) reject(error);
        logger.info('delete-remote', `Successfully deleted ${key}`);
        resolve(data);
      });
    }
    resolve();
  });

const fetchRemote = (config, key, imageName) =>
  new Promise(async (resolve, reject) => {
    const imageDir = await resolveImagePath(key, config);
    const remoteFileName = `${config.browser}/${key}/${imageName}`;
    const fileName = `${imageDir}/${imageName}`;
    const s3 = new AWS.S3();
    AWS.config.update({ region: config.remoteRegion });
    const params = { Bucket: config.remoteBucketName, Key: remoteFileName };

    s3.getObject(params, (error, data) => {
      if (error) reject(error);
      fs.writeFileSync(fileName, data.Body);
      resolve();
    });
  });

const listRemote = (key, config) =>
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

const uploadRemote = async (key, config) => {
  const imageDir = await resolveImagePath(key, config);
  AWS.config.update({
    region: config.remoteRegion
  });
  const s3 = new AWS.S3();
  const files = fs.readdirSync(imageDir).map(file => `${imageDir}/${file}`);

  if (files.length !== 0) {
    logger.info(
      'upload-remote',
      `${files.length} images to be uploaded to bucket: ${key}`
    );
  }

  return Promise.all(
    files.map(file => {
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

      const putObjectPromise = s3.putObject(uploadParams).promise();

      const promises = [];
      promises.push(putObjectPromise);
      return Promise.all(promises);
    })
  );
};

export {
  deleteRemote,
  fetchRemote,
  listRemote,
  resolveImagePath,
  uploadRemote
};
