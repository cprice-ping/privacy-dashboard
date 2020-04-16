// app/torii-providers/github.js
import OAuth2BearerProvider from 'torii/providers/oauth2-bearer';
import config from 'privacy-dashboard/config/environment';
export default OAuth2BearerProvider.extend({
  name: 'ping-oauth2',
  baseUrl: `${config.APP.PF_HOST_PORT}/as/authorization.oauth2`,
  redirectUri: window.location.href,
  apiKey: '',
  fetch(data) {
    return data;
  },
  init() {
    this.set('responseParams', ['access_token', 'expires_in']);
    this._super(...arguments);
  },
});
