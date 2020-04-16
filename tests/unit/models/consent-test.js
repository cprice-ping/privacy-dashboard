import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | consent', function(hooks) {
  setupTest(hooks);

  test('Consent details come from context', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('consent');
    model.set('context', {
      ip: "8.8.8.8",
      browser: "Firefox"
    });

    assert.equal(model.get('consentIpAddress'), '8.8.8.8');
    assert.equal(model.get('consentBrowser'), 'Firefox');
  });
});
