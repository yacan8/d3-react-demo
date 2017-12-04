const path = require('path');
module.exports = {
  entry: {
    vendor: ['react', 'react-dom', 'd3', 'lodash']
  },
  path: path.join(process.cwd(), 'dll-dev'),
  debug: true
};
