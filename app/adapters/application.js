import HalAdapter from "ember-data-hal-9000/adapter";
import config from 'privacy-dashboard/config/environment';
import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { run } from '@ember/runloop';
import { inject } from '@ember/service';
import $ from 'jquery';

export default HalAdapter.extend(DataAdapterMixin, {
  host: config.APP.PD_HOST_PORT,
  namespace: 'consent/v1',
  session: inject(),
  headers: computed('headers', function() {
    return {
      'Content-Type': 'application/hal+json',
      'accept':"*/*"
    };
  }),

  authorize(xhr) {
    try {
      // if this fails it's ok, because we'll retry automatically
      let { access_token } = this.get('session.data.authenticated.authorizationToken');
      if (isPresent(access_token)) {
        xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
      }
    }
    catch(e) {
      // noop
    }
  },

  _ajaxRequest(options) {
    if (this.get('session.isAuthenticated')) {
      // Sometimes we think the session is good, but it's actually not because the
      // user has logged out of the parent application and logged back in.
      // And we can't look at the cookie the login system sets because it's secure

      let request = $.ajax(options);
      request.catch(() => {
        run(() => {
          this.get('session').invalidate();
        });
      });
    }
    else {
      this.get('session').authenticate('authenticator:torii').then(() => {
        $.ajax(options);
      });
    }
  },

  ajaxOptions(url, method, options) {
    return this._super(url, method, options);
  }
});
