/* globals jest */

const read = jest.fn().mockImplementation(() =>
  Promise.resolve({
    crop: () =>
      Promise.resolve({ write: jest.fn().mockReturnValue(Promise.resolve()) })
  })
);

export default { read };
