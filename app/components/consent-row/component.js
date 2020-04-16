import Component from '@ember/component';
import { inject } from '@ember/service';
import { task } from 'ember-concurrency';
import { retryable, DelayPolicy } from 'ember-concurrency-retryable';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';
import { get } from '@ember/object';

export default Component.extend({
  store: inject(),
  classNames: ['consent-row'],

  saveConsentStateTask: retryable(task(function * (newState) {
    const record = this.get('record');
    record.set('status', newState);
    return yield record.save();
  }).restartable().cancelOn('deactivate'), new DelayPolicy({delay: [500, 500]})),

  saveConsentDetailsTask: retryable(task(function * (details) {
    const record = get(this, 'record');
    record.set('consentDetails', details);
    return yield record.save();
  }).restartable().cancelOn('deactivate'), new DelayPolicy({delay: [500, 500]})),

  selected: computed('record.status', {
    get() {
      return this.get('record.availableActions').find(item => (item.state === this.get('record.status')));
    }
  }),

  availableActions: computed.alias('record.availableActions'),

  actions: {
    onDataRequest(type) {
      this.get('requestDataTask').perform(type);
    },

    saveConsentDetails(consentDetails) {
      this.get('saveConsentDetailsTask').perform(consentDetails);
    },

    saveConsentState(newState) {
      this.get('saveConsentStateTask').perform(newState ? 'accepted' : 'revoked');
    },

    toggleShowConsentContext() {
      this.set('showConsentContext', true);
      later(() => {
        this.set('showConsentContext', false)
      }, 5000);
    }
  }
});
