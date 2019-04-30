/* globals expect */

import { execSync } from 'child_process';

describe('e2e Tests remove elements', () => {
  it('remove elements from webpage and compares', () => {
    let exitCode = 0;

    try {
      const snapOutput = execSync(
        'node ./lib/bin/run.js snap --browser chrome --config e2eTests/chrome/removeElements/removeElementsConfig.json'
      ).toString();
      console.log(snapOutput);

      const compareOutput = execSync(
        'node ./lib/bin/run.js compare --browser chrome --config e2eTests/chrome/removeElements/removeElementsConfig.json'
      ).toString();
      console.log(compareOutput);
    } catch (err) {
      console.log(err.stdout.toString());
      console.log(err.stderr.toString());
      exitCode = err.status;
    }

    expect(exitCode).toEqual(0);
  });
});
