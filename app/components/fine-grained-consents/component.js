import { inject } from '@ember/service';
import $ from 'jquery';
import Component from '@ember/component';
import fetch from 'fetch';

let instanceCount = 0;

export default Component.extend({
  session: inject(),

  classNames: ['fine-grained-consents'],
  isLoaded: false,
  classNameBindings: ['isLoaded'],
  consentDetails: null,
  iframeSrc: null,
  identity: null,
  contentWindow: null,

  init() {
    this._super(...arguments);
    let instance = "" + ++instanceCount;
    this.set('identity', instance);
  },

  didUpdateAttrs() {
    this.sendMessage({
      action: 'get:dimensions'
    });
  },

  sendMessage(message) {
    this.get('contentWindow').postMessage(JSON.stringify(message), '*')
  },

  receiveMessage(message) {
    let messageData;
    try {
      messageData = JSON.parse(message.data);
    } catch(e) { return; }

    const {action, data, identity} = messageData;

    if (identity === this.get('identity')) {
      if (action === 'ready') {
        this.sendMessage({
          action: 'set:details',
          data: this.get('consentDetails')
        });
        this.set('isLoaded', true);
      }
      else if (action === 'set:dimensions') {
        this.set('width', data.width);
        this.set('height', data.height);
      }
      else if (action === 'set:details') {
        this.get('onUpdate')(data);
      }
      else if (action === 'xhr:json') {
        const { xhrId, url, queryParams } = data;
        let headers = {
          "Accept": "application/json, */*"
        };
        const token = this.get('session.data.authenticated.authorizationToken.access_token');
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        let queryString = '';
        if ($.isPlainObject(queryParams)) {
          queryString = $.param(queryParams);
        }
        let responseStatus;
        fetch(queryString.length ? `${url}?${queryString}` : url, {headers})
          .then((response) => {
            responseStatus = response.status;
            if (response.ok) {
              return response.json();
            }
            else {
              throw response.statusText;
            }
          })
          .then((json) => {
            this.sendMessage({
              action: 'xhr:json',
              data: {xhrId, url, queryParams, data: json, status: responseStatus}
            });
          })
          .catch((error) => {
            this.sendMessage({
              action: 'xhr:json',
              data: {xhrId, url, queryParams, error: error.toString(), status: responseStatus || -1}
            });
          })
      }
    }
    else {
      // not for us
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.set('contentWindow', this.$('iframe')[0].contentWindow);
    this.$(window)[0].addEventListener('message', (e) => {
       this.receiveMessage(e);
    });
  }
});
