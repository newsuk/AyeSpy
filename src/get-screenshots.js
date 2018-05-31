export default (SnapShotter, config) =>
  Promise.all(
    config.scenarios.map(scenario => {
      const snap = new SnapShotter({
        browser: config.browser,
        gridUrl: config.gridUrl,
        height: scenario.height,
        width: scenario.width
      });

      const promises = [];
      promises.push(snap.takeSnap(scenario));
      return Promise.all(promises);
    })
  );
