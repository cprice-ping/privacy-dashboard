import DS from 'ember-data';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import fetch from 'fetch';
import { computed } from '@ember/object';
import config from 'privacy-dashboard/config/environment';
import { task } from "ember-concurrency";

/*

{
    "_links": {
        "localizations": [...]
    },
    "id": "share-call-history",
    "displayName": "Share Call History"
}

 */

export default DS.Model.extend({
  localizations         : hasMany('localization', { async: true, inverse: 'definition' }),

  displayName           : attr('string'),
  hasFineGrainedConsent : false,

  iframeSrc             : computed('id', function() {
    return `${config.rootURL}assets/fine-grained-consents/${this.id}.html`
  }),

  initAsyncTask: task(function * () {
    if (this.get('hasFineGrainedConsent') !== null) {
      const response = yield fetch(this.get('iframeSrc'));
      this.set('hasFineGrainedConsent', response.ok);
    }
  }).drop(),

  init() {
    this.initAsyncTask.perform();
    this._super(...arguments);
  },

  async hackLoadLocalizations() {
    await this.hasMany('localizations').load();
    return this.get('localizations');
  }
});
