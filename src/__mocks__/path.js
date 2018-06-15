/* globals jest */

const path = jest.genMockFromModule('path');
path.resolve = () => 'mock/resolved/path';
path.basename = file => file;

export default path;
