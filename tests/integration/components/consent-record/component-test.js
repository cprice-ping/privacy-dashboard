import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | consent-row', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('record', {});

    await render(hbs`{{consent-row record=record}}`);
    assert.ok(find('.consent-row'));
  });
});
