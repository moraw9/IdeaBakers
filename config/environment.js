'use strict';

module.exports = function (environment) {
  let ENV = {

    modulePrefix: 'idea-bakers',
    environment,
    rootURL: '/',
    locationType: 'auto',
    
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    firebase: {
      apiKey: 'AIzaSyCDm0NDtQLio5iIyReouRymZBM9_AwSvTI',
      authDomain: 'ideabakers-c756c.firebaseapp.com',
      projectId: 'ideabakers-c756c',
      storageBucket: 'ideabakers-c756c.appspot.com',
      messagingSenderId: '1015093689161',
      appId: '1:1015093689161:web:87653614b931daec5cf898',
      measurementId: 'G-GZBEW44Z8M',
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
