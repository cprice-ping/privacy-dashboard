import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import { inject } from '@ember/service';

export default ToriiAuthenticator.extend({
  torii: inject(),

  authenticate() {
    return this._super('ping-oauth2', {});
  }
});
