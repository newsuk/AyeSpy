import path from 'path';
import { By } from 'selenium-webdriver';
import fs from 'fs';

const loadFile = script => {
  if (!fs.existsSync(script))
    throw new Error(`Error: Could not find the file: ${script}`);
  return require(path.resolve(script)); // eslint-disable-line
};

export function executeScript(script) {
  return execute(script);
}

export function executeScriptWithDriver(driver, script) {
  return execute(script, driver, By);
}

function execute(script, ...params) {
  return new Promise(async (resolve, reject) => {
    try {
      const scriptToExecute = loadFile(script);
      await scriptToExecute(...params);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
