import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | popup-menu', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('options', [{name: "menu 1", action: "action_1"}, {name: "menu 2", action: "action_2"}]);

    this.set('open', false);
    await render(hbs`{{popup-menu options=options open=open}}`);

    assert.equal(findAll('.tooltip-menu-option').length, 0);

    this.set('open', true);
    assert.equal(findAll('.tooltip-menu-option').length, 2);
    assert.deepEqual(findAll('.tooltip-menu-option').map(e => e.text), ['menu 1', 'menu 2']);
  });
});
