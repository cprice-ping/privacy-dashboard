import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { task } from 'ember-concurrency';
import { retryable, DelayPolicy } from 'ember-concurrency-retryable';

export default Route.extend({
  session: inject(),

  model({definition_id}) {
    return {
      consentInitTaskInstance: this.get('consentInitTask').perform(definition_id)
    }
  },

  consentInitTask: retryable(task(function * (definition_id) {
    const definition = yield this.store.loadRecord('definition', definition_id);
    const localization = yield this.getLocalization(definition);
    const defaultText = this.getDefaultText(localization);
    yield definition.get('initAsyncTask').last; // make sure the async init completed
    return this.store.createRecord('consent', {
      audience: 'privacy-dashboard',
      definition: definition,
      localization: localization,
      titleText: defaultText.titleText,
      dataText: defaultText.dataText,
      purposeText: defaultText.purposeText
    });
  }).restartable().cancelOn('deactivate'), new DelayPolicy({delay: [500, 500]})),

  async getLocalization(definition) {
    const localizations = await definition.hackLoadLocalizations(); // FIXME
    const localization = localizations.firstObject;
    return localization;
  },

  getDefaultText(localization) {
    return {
      titleText: localization.get('titleText'),
      dataText: localization.get('dataText'),
      purposeText: localization.get('purposeText')
    };
  }

});
