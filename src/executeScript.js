import path from 'path';
import { By } from 'selenium-webdriver';

const loadFile = (script) => require(path.resolve(script)); // eslint-disable-line

export async function executeScript(script) {
  const scriptToExecute = loadFile(script);
  return scriptToExecute();
}

export async function executeScriptWithDriver(driver, script) {
  const scriptToExecute = loadFile(script);
  return scriptToExecute(driver, By);
}
