import logger from './logger';

const filterScenario = (config, filter) => {
  return new Promise(resolve => {
    const filteredScenario = Object.values(config.scenarios).filter(
      scenario => scenario.label === filter
    );

    if (filteredScenario.length === 0) {
      logger.info(
        'filterConfig',
        `❗️ ${filter}  not found on your scenarios. Exiting Aye Spy`
      );
      process.exitCode = 1;
      process.exit();
    }
    resolve(filteredScenario);
  });
};

export default filterScenario;
