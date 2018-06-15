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
      findElement: element => Promise.resolve(element),
      setRect: jest.fn(),
      get: jest.fn(),
      takeScreenshot: jest.fn(),
      wait: jest.fn(),
      quit: jest.fn(),
      executeScript: jest.fn(),
      addCookie: jest.fn()
    };
    return wrap;
  }
}

const By = {
  css: selector => selector
};

const until = {
  elementIsVisible: selector => selector
};

export default {
  Builder,
  Capabilities: {
    chrome: jest.fn(),
    firefox: jest.fn()
  }
};

export { By, until };
