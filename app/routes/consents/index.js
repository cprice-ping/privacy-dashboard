import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { task } from 'ember-concurrency';
import { retryable, DelayPolicy } from 'ember-concurrency-retryable';

export default Route.extend({
  session: inject(),

  model() {
    return {
      consentTaskInstance: this.get('consentTask').perform()
    }
  },

  consentTask: retryable(task(function * () {
    // If this fails because it's not actually authenticated the adapter
    // will automatically invalidate the session and reauthorize on the second
    // attempt
    yield this.get('definitionTask').perform();

    return yield this.store.loadAll('consent');
  }).restartable().cancelOn('deactivate'), new DelayPolicy({delay: [500, 500]})),

  definitionTask: task(function * () {
    return yield this.store.loadAll('definition')
  })
});
