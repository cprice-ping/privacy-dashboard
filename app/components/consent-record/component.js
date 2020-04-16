import Component from '@ember/component';

export default Component.extend({
  classNames: ['consent-record'],
  actions: {
    detailsUpdated(consentDetails) {
      const onDetailsUpdate = this.get('onDetailsUpdate');
      if (onDetailsUpdate) {
        onDetailsUpdate(consentDetails);
      }
    }
  }
});
