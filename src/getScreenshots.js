export default (SnapShotter, config) =>
  Promise.all(
    config.scenarios.map(scenario => {
      if (!scenario.viewports)
        throw `${scenario.label} has no viewpoorts array defined`;
      if (scenario.viewports.some(viewport => !viewport.height))
        throw `${scenario.label} has no height set`;
      if (scenario.viewports.some(viewport => !viewport.width))
        throw `${scenario.label} has no width set`;
      if (scenario.viewports.some(viewport => !viewport.label))
        throw `${scenario.label} has no label set`;

      const promises = [];
      scenario.viewports.forEach(viewport => {
        const snap = new SnapShotter({
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
          url: scenario.url
        });

        promises.push(snap.takeSnap());
      });

      return Promise.all(promises);
    })
  );
