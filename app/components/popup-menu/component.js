import Component from '@ember/component';
import { next } from '@ember/runloop';
import ClickOutsideMixin from 'ember-click-outside/mixin';
export default Component.extend(ClickOutsideMixin, {
  init() {
    this.set('open', false);
    this._super(...arguments);
  },
  clickOutside() {
    this.set('open', false);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.removeClickOutsideListener()
  },

  didInsertElement() {
    this._super(...arguments);
    next(this, this.addClickOutsideListener);
  },

  actions: {
    toggleMenu() {
      this.toggleProperty('open');
    },
    optionSelected(option) {
      if (this.get('onSelect')) {
        this.get('onSelect')(option);
      }
    }
  }
});
