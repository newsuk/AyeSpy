export default (fs, config) =>
  new Promise(resolve => {
    const directories = [];
    directories.push(config.latest, config.generatedDiffs, config.baseline);

    directories.forEach(dir => {
      fs.access(dir, err => {
        if (err) fs.mkdirSync(dir);
      });
    });

    resolve();
  });
