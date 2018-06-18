const comparisonDataConstructor = () =>
  Promise.resolve([
    {
      label: 'test1-large',
      baseline: 'testBaseline/test1-large.png',
      latest: 'testLatest/test1-large.png',
      generatedDiffs: 'testDiff/test1-large.png',
      tolerance: 0
    }
  ]);

export default comparisonDataConstructor;
