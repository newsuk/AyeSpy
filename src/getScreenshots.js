import webdriver, { By, until } from 'selenium-webdriver';
import scenarioValidator from './scenarioValidator';

const generateSnapShotsPromises = (SnapShotter, config) =>
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
            removeSelectors: scenario.removeSelectors,
            waitForSelector: scenario.waitForSelector,
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

function getScreenshots(SnapShotter, config, requestLimit) {
  return new Promise(resolve => {
    const promises = generateSnapShotsPromises(SnapShotter, config);
    const limit = requestLimit || promises.length;

    const iterationsToPerform = Math.ceil(promises.length / requestLimit);
    let iterations = 0;

    while (iterations !== iterationsToPerform) {
      const splice = promises.splice(0, limit);

      Promise.all(splice.map(screenshot => screenshot.takeSnap()));
      iterations++;
    }

    resolve();
  });
}

export default getScreenshots;
