// config/dotenv.js
module.exports = function() {
  return {
    clientAllowedKeys: ['PD_HOST_PORT', 'PF_HOST_PORT', 'OAUTH2_SCOPES'],
    failOnMissingKey: true
  };
};
