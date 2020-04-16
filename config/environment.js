'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'privacy-dashboard',
    environment,
    rootURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    torii: {
     sessionServiceName: 'toriiSession',
     allowUnsafeRedirect: true,
     providers: {
       'ping-oauth2': {
         remoteServiceName: 'popup',
         scope: process.env.OAUTH2_SCOPES,
         clientId: 'privacy-dashboard',
         responseType: 'token',
         authUri: `${process.env.PF_HOST_PORT}/as/authorization.oauth2`
       }
     }
   },

    APP: {
      PD_HOST_PORT: process.env.PD_HOST_PORT,
      PF_HOST_PORT: process.env.PF_HOST_PORT,

      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  // ENV.APP.rootElement = '#privacy_dashboard';

  ENV['simple-auth'] = {
    authorizer: 'simple-auth-authorizer:token'
  };

  ENV['simple-auth-token'] = {
    refreshAccessTokens: true,
    tokenExpireName: 'exp',
    timeFactor: 1,
    refreshLeeway: 300,
    identificationField: 'clientId',
    tokenPropertyName: 'access_token',
    serverTokenEndpoint: `${process.env.PF_HOST_PORT}/as/authorization.oauth2`,
    serverTokenRefreshEndpoint: `${process.env.PF_HOST_PORT}/as/authorization.oauth2`
  };

  if (environment === 'development') {

    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV['ember-cli-mirage'] = {
      enabled: false
    }
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
    ENV.APP.PD_HOST_PORT = 'http://example.com';
    ENV.APP.PF_HOST_PORT = 'http://example.com';
    ENV['ember-cli-mirage'] = {
      enabled: true
    }
  }

  if (environment === 'production') {
    // this gets replaced by some code in index.html
    ENV.rootURL = '/privacy/';

    // here you can enable a production-specific feature
  }

  return ENV;
};
