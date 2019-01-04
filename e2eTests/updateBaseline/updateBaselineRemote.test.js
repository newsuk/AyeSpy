/* globals expect jest*/

import { execSync } from 'child_process';
import ayeSpyConfig from './updateBaselineRemoteAyeSpyConfig';
import {
  createRemote,
  deleteRemoteBucket,
  deleteRemoteKeys,
  listRemoteKeys
} from '../../lib/remoteActions';

jest.unmock('aws-sdk');

describe('e2e Tests updating baseline shots remotely', () => {
  beforeEach(async () => {
    //create the bucket on s3 ready for the test to upload the new baseline images
    await createRemote(ayeSpyConfig);
  });

  afterEach(async () => {
    //delete the specific folder from the bucket
    await deleteRemoteKeys('baseline', ayeSpyConfig);
    //delete the empty bucket itself
    await deleteRemoteBucket(ayeSpyConfig);
  });

  it.skip('Uploads the local latest images to the remote baseline folder', async () => {
    // uploads your local latest images to the remote baseline folder
    const stdout = await execSync(
      'node ./lib/bin/run.js update-baseline --browser firefox --remote --config e2eTests/updateBaseline/updateBaselineRemoteAyeSpyConfig.json'
    ).toString();

    // pipe stdout to Jest console
    console.log(stdout);

    //list the contents of the bucket based on the filter
    const bucketObjects = await listRemoteKeys(
      'baseline/testImage.png',
      ayeSpyConfig
    );
    const firstBucketImage = bucketObjects[0].Key;
    expect(firstBucketImage).toEqual('chrome/baseline/testImage.png');
  });
});
