import webdriver, { By, until } from 'selenium-webdriver';
import scenarioValidator from './scenarioValidator';

const generateSnapShotPromises = (SnapShotter, config) =>
  config.scenarios.reduce((accum, scenario) => {
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
            waitForElement: scenario.waitForElement,
            url: scenario.url,
            onBeforeScript: scenario.onBeforeScript,
            onReadyScript: scenario.onReadyScript,
            wait: scenario.wait
          },
          { webdriver, By, until }
        )
      );
    });
    return accum;
  }, []);

async function getScreenshots(SnapShotter, config) {
  return new Promise(async resolve => {
    const promises = generateSnapShotPromises(SnapShotter, config);
    const requestLimit =
      config.limitAmountOfParallelScenarios || promises.length;

    const iterationsToPerform = Math.ceil(promises.length / requestLimit);

    for (let i = 0; i < iterationsToPerform; i++) {
      const splice = promises.splice(0, requestLimit);

      const executingPromises = splice.map(screenshot => screenshot.takeSnap());
      await Promise.all(executingPromises);
    }

    resolve();
  });
}

export default getScreenshots;
