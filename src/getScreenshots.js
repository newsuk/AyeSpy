import webdriver, { By, until } from 'selenium-webdriver';
import scenarioValidator from './scenarioValidator';
import ProgressBar from './progressBar';
import { executeScript } from './executeScript';

const onComplete = () => ProgressBar.tick();
const onError = () => ProgressBar.stop();

const generateSnapShotPromises = (SnapShotter, config) => {
  return config.scenarios.reduce((accum, scenario) => {
    scenarioValidator(scenario);

    scenario.viewports.forEach(viewport => {
      accum.push(
        new SnapShotter(
          {
            label: scenario.label,
            latest: config.latest,
            browser: config.browser,
            mobileDeviceName: scenario.mobileDeviceName,
            gridUrl: config.gridUrl,
            height: viewport.height,
            width: viewport.width,
            viewportLabel: viewport.label,
            cookies: scenario.cookies,
            cropToSelector: scenario.cropToSelector,
            removeElements: scenario.removeElements,
            hideElements: scenario.hideElements,
            waitForElement: scenario.waitForElement,
            waitForIFrameElement: scenario.waitForIFrameElement,
            url: scenario.url,
            onBeforeScript: scenario.onBeforeScript,
            onReadyScript: scenario.onReadyScript,
            wait: scenario.wait
          },
          { webdriver, By, until },
          onComplete,
          onError
        )
      );
    });
    return accum;
  }, []);
};

function executeOnBeforeSuiteScript(config) {
  return executeScript(config.onBeforeSuiteScript, config).catch(error => {
    throw new Error(
      `❌  Unable to run onBeforeSuite script:\n  due to: ${error}`
    );
  });
}

async function getScreenshots(SnapShotter, config) {
  return new Promise(async (resolve, reject) => {
    if (config.onBeforeSuiteScript) {
      try {
        await executeOnBeforeSuiteScript(config);
      } catch (error) {
        onError();
        return reject(error);
      }
    }

    const promises = generateSnapShotPromises(SnapShotter, config);

    ProgressBar.setLength(promises.length);

    const requestLimit =
      config.limitAmountOfParallelScenarios || promises.length;

    const iterationsToPerform = Math.ceil(promises.length / requestLimit);

    ProgressBar.start();

    for (let i = 0; i < iterationsToPerform; i++) {
      const splice = promises.splice(0, requestLimit);

      const executingPromises = splice.map(screenshot => screenshot.takeSnap());
      await Promise.all(executingPromises);
    }

    resolve();
  });
}

export default getScreenshots;
