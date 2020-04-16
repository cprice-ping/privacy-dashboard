import Component from '@ember/component';
import { inject } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: inject(),
  classNames: ['consent-capture'],

  saveConsentTask: task(function * (accepted) {
    const record = this.get('record');
    record.set('status', accepted ? 'accepted' : 'denied');
    yield this.get('record').save();
    const onConsentSave = this.get('onConsentSave');
    if (onConsentSave) {
      onConsentSave();
    }
  }).drop(),

  actions: {
    setConsentDetails(consentDetails) {
      const record = this.get('record');
      record.set('consentDetails', consentDetails);
    },

    saveConsent(accepted) {
      this.get('saveConsentTask').perform(accepted);
    }
  }
});
