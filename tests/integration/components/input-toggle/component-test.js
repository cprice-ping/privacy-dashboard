import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | input-toggle', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders in an on state', async function(assert) {
    this.set('selected', true);
    await render(hbs`{{input-toggle selected=selected}}`);
    assert.ok(find('.selected'));
  });

  test('it renders in an off state', async function(assert) {
    this.set('selected', false);
    await render(hbs`{{input-toggle selected=selected}}`);
    assert.ok(!find('.selected'));
  });

  test('it calls the handler on change', async function(assert) {
    this.set('selected', true);
    let changeCalled = false;
    this.set('onChange', () => {
      changeCalled=true;
    })
    await render(hbs`{{input-toggle selected=selected onChange=onChange}}`);
    assert.equal(changeCalled, false);

    await click('.input-toggle')
    assert.equal(changeCalled, true);
    assert.equal(this.get('selected'), false);
  });
});
