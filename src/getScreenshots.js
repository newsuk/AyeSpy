export default (SnapShotter, config) =>
  Promise.all(
    config.scenarios.map(scenario => {
      const promises = [];

      if (config.viewports) {
        config.viewports.forEach(viewport => {
          const fileName = scenario.label + '-' + viewport.label;
          const snap = new SnapShotter({
            latest: config.latest,
            browser: config.browser,
            gridUrl: config.gridUrl,
            height: viewport.height,
            width: viewport.width
          });
          promises.push(snap.takeSnap(scenario, fileName));
          return Promise.all(promises);
        });
      } else {
        const snap = new SnapShotter({
          latest: config.latest,
          browser: config.browser,
          gridUrl: config.gridUrl,
          height: scenario.height,
          width: scenario.width
        });
        promises.push(snap.takeSnap(scenario));
        return Promise.all(promises);
      }

      // if(config.viewports) {
      //   config.viewports.forEach(viewport => {
      //     const fileName = scenario.label + '-' + viewport.label;
      //     promises.push(snap.takeSnap(scenario, viewport.height, viewport.width, fileName));
      //   })
      // } else {
      //   promises.push(snap.takeSnap(scenario));
      // }
    })
  );
