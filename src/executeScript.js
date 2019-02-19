import path from 'path';
import { By } from 'selenium-webdriver';

const loadFile = (script) => require(path.resolve(script)); // eslint-disable-line

export function executeScript(script) {
  return new Promise(async (resolve, reject) => {
    try {
      const scriptToExecute = loadFile(script);
      await scriptToExecute();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export async function executeScriptWithDriver(driver, script) {
  const scriptToExecute = loadFile(script);
  return scriptToExecute(driver, By);
}
