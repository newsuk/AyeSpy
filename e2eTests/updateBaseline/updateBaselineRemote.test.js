/* globals expect jest*/

import { execSync } from 'child_process';
import ayeSpyConfig from './updateBaselineRemoteAyeSpyConfig';
import {
  createRemote,
  deleteRemoteBucket,
  deleteRemoteKey,
  listRemote
} from '../../lib/remoteActions';

jest.unmock('aws-sdk');

describe('e2e Tests updating baseline shots remotely', () => {
  beforeEach(async () => {
    //create the bucket on s3 ready for the test to upload the new baseline images
    await createRemote(ayeSpyConfig);
  });

  afterEach(async () => {
    //delete the specific folder from the bucket
    await deleteRemoteKey('baseline', ayeSpyConfig);
    //delete the empty bucket itself
    await deleteRemoteBucket(ayeSpyConfig);
  });

  it('Uploads the local latest images to the remote baseline folder', async () => {
    // uploads your local latest images to the remote baseline folder
    // const stdout = await execSync(
    //   'node ./lib/bin/run.js update-baseline --browser chrome --remote --config e2eTests/updateBaseline/updateBaselineRemoteAyeSpyConfig.json'
    // ).toString();

    //pipe stdout to Jest console
    // console.log(stdout);
    try{
      await execSync(
        'node ./lib/bin/run.js update-baseline --browser chrome --remote --config e2eTests/updateBaseline/updateBaselineRemoteAyeSpyConfig.json'
      )
    } catch(err) {
      console.log(err)
    }
    //list the contents of the bucket based on the filter
    const bucketObjects = await listRemote(
      'baseline/testImage.png',
      ayeSpyConfig
    );
    const firstBucketImage = bucketObjects[0].Key;
    expect(firstBucketImage).toEqual('chrome/baseline/testImage.png');
  });
});
