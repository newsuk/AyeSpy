import webdriver, { By, until } from 'selenium-webdriver';
import scenarioValidator from './scenarioValidator';

export default (SnapShotter, config, limit) =>
  Promise.all(
    config.scenarios.map(scenario => {
      return limit(() => getScreenshot(scenario, SnapShotter, config));
    })
  );

function getScreenshot(scenario, SnapShotter, config) {
  return new Promise(resolve => {
    scenarioValidator(scenario);
    const promises = [];
    scenario.viewports.forEach(viewport => {
      const snap = new SnapShotter(
        {
          label: scenario.label,
          latest: config.latest,
          browser: config.browser,
          mobileDeviceName: scenario.mobileDeviceName,
          gridUrl: config.gridUrl,
          gridLimit: config.gridLimit,
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
      );
      promises.push(snap.takeSnap());
    });
    resolve(Promise.all(promises));
  });
}
