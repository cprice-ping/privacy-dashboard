import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    consentCaptured() {
      this.transitionToRoute('consents.index');
    }
  }
})
