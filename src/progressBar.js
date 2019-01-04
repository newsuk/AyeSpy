import cliProgress from 'cli-progress';

class ProgressBar {
  constructor() {
    this._cliProgress = new cliProgress.Bar(
      {
        barsize: 65,
        stopOnComplete: true,
        stream: process.stderr,
        format:
          '   Progress [{bar}] {percentage}% | ETA: {eta}s | Snapped {value}/{total}'
      },
      cliProgress.Presets.legacy
    );
    this._sizeOfProgressBar = 0;
    this._tick = 0;
  }

  setLength(length) {
    this._sizeOfProgressBar = length;
  }

  start() {
    console.log(''); // eslint-disable-line no-console // space for progress bar
    this._cliProgress.start(this._sizeOfProgressBar, 0);
  }

  tick() {
    this._tick++;
    this._cliProgress.update(this._tick);
  }
}

export default new ProgressBar();
