import listObjectFixtures from './s3ListObjectsFixtures';

const mockGetObjectResponse = {
  AcceptRanges: 'bytes',
  LastModified: '2018-06-14T10:16:01.000Z',
  ContentLength: 498603,
  ETag: '"96fd5c5b6f03dd5fa95a5eb9dbf21fb2"',
  ContentType: 'image/png',
  Metadata: {},
  Body: 'buffer obj'
};

export default class S3 {
  listObjectsV2(config, callback) {
    callback(null, listObjectFixtures);
  }

  deleteObjects(params, callback) {
    callback(null, params.Delete.Objects);
  }

  getObject(params, callback) {
    callback(null, mockGetObjectResponse);
  }

  putObject(config) {
    return { promise: () => Promise.resolve(config) };
  }
}
