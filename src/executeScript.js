import path from 'path';
import { By } from 'selenium-webdriver';

export default async function executeScript(driver, script) {
  const scriptToExecute = require(path.resolve(script)); // eslint-disable-line
  return scriptToExecute(driver, By);
}
