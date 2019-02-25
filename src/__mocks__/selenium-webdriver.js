/* globals jest */

class Element {
  constructor(selector) {
    this._selector = selector;
  }

  get selector() {
    return this._selector;
  }

  getRect() {
    return Promise.resolve({
      x: 100,
      y: 200,
      width: 300,
      height: 400
    });
  }
}

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
      findElement: element => new Element(element),
      switchTo: jest.fn().mockReturnValue({ defaultContent: jest.fn() }),
      setRect: jest.fn(),
      getRect: jest.fn(),
      get: jest.fn(),
      takeScreenshot: jest.fn().mockReturnValue('screenshot-data'),
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
  elementIsVisible: selector => selector,
  elementLocated: jest.fn(),
  ableToSwitchToFrame: () => true
};

export default {
  Builder,
  Capabilities: {
    chrome: jest.fn(),
    firefox: jest.fn()
  }
};

export { By, until };
