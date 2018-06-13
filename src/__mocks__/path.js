/* globals jest */

const path = jest.genMockFromModule('path');
path.resolve = () => 'resolution';

export default path;
