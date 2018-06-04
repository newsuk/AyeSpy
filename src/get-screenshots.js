import path from 'path';

export default (fs, SnapShotter, config) => {
  const latestDir = path.resolve(config.latest);
  fs.access(latestDir, err => {
    if (err) fs.mkdirSync(latestDir);

    return Promise.all(
      config.scenarios.map(scenario => {
        const snap = new SnapShotter({
          latest: config.latest,
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
  });
};
