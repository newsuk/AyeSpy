const filterToScenario = (config, filter) => {
  const filteredScenario = Object.values(config.scenarios).filter(
    scenario => scenario.label === filter
  );

  if (filteredScenario.length === 0) {
    throw new Error(
      `❗️ ${filter}  not found on your scenarios. Exiting Aye Spy`
    );
  }

  return filteredScenario;
};

export default filterToScenario;
