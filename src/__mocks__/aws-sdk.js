import listObjectFixtures from './s3ListObjectsFixtures';

class S3 {
  listObjectsV2(config, callback) {
    callback(null, listObjectFixtures);
  }

  deleteObjects(params, callback) {
    callback(null, params.Delete.Objects);
  }
}

export default {
  config: {
    update: () => {}
  },
  S3
};
