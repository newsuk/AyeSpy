/* globals expect jest*/

import { execSync } from 'child_process';
import config from './updateBaselineRemoteConfig';
import {
  createRemote,
  deleteRemoteBucket,
  deleteRemote,
  listRemote
} from '../../lib/remoteActions';

jest.unmock('aws-sdk');

describe('e2e Tests updating baseline shots remotely', () => {
  beforeEach(async () => {
    //create the bucket on s3 ready for the test to upload the new baseline images
    await createRemote(config);
  });

  afterEach(async () => {
    //delete the specific folder from the bucket
    await deleteRemote('baseline', config);
    //delete the empty bucket itself
    await deleteRemoteBucket(config);
  });

  it('Uploads the local latest images to the remote baseline folder', async () => {
    // uploads your local latest images to the remote baseline folder
    const stdout = await execSync(
      'node ./lib/bin/run.js update-baseline --browser chrome --remote --config e2eTests/updateBaseline/updateBaselineRemoteConfig.json'
    ).toString();

    //pipe stdout to Jest console
    console.log(stdout);
    //list the contents of the bucket based on the filter
    const bucketObjects = await listRemote('baseline/testImage.png', config);
    expect(bucketObjects[0].Key).toEqual('chrome/baseline/testImage.png');
  });
});
