'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-inline-styles': [
      true,
      {
        allowDynamicStyles: true,
      },
    ],
    'style-concatenation': true,
  },
};
