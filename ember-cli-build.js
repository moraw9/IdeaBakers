'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      exclude: ['firebase'],
    },
    'ember-bootstrap': {
      bootstrapVersion: 4,
      importBootstrapCSS: false,
    },
    'ember-cli-string-helpers': {
      only: ['html-safe'],
    },
    'ember-composable-helpers': {
      only: ['sort-by'],
    },
  });

  app.import('vendor/ember-firebase-service/firebase/firebase-auth.js');
  app.import('vendor/ember-firebase-service/firebase/firebase-firestore.js');

  return app.toTree();
};
