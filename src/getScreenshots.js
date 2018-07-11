import webdriver, { By, until } from 'selenium-webdriver';
import scenarioValidator from './scenarioValidator';

export default (SnapShotter, config) =>
  Promise.all(
    config.scenarios.map(scenario => {
      scenarioValidator(scenario);

      const promises = [];
      scenario.viewports.forEach(viewport => {
        const snap = new SnapShotter(
          {
            label: scenario.label,
            latest: config.latest,
            browser: config.browser,
            gridUrl: config.gridUrl,
            height: viewport.height,
            width: viewport.width,
            viewportLabel: viewport.label,
            cookies: scenario.cookies,
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

      return Promise.all(promises);
    })
  );
