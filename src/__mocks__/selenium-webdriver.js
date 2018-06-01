/* globals jest */

class Builder {
  usingServer() {
    return this;
  }

  withCapabilities() {
    return this;
  }

  build() {
    const wrap = {
      manage: () => {
        return wrap;
      },
      window: () => {
        return wrap;
      },
      setRect: jest.fn(),
      get: jest.fn(),
      takeScreenshot: jest.fn(),
      quit: () => {
        return wrap;
      }
    };
    return wrap;
  }
}

export default {
  Builder,
  Capabilities: {
    chrome: jest.fn(),
    firefox: jest.fn()
  }
};
