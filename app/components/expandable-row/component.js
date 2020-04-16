import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['item'],
  classNameBindings: ['expanded', 'subtitle:has-subtitle'],
  attributeBindings: ['dataId:data-id'],
  dataId: 'expandable-row',
  expanded: false,

  rowStyle: computed('expanded', function() {
    if (!this.get('expanded')) {
      return htmlSafe('display:none');
    }
  }),

  actions: {
    toggleExpand() {
      this.set('expanded', !this.get('expanded'));
    }
  }
});
