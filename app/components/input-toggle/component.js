import Component from '@ember/component';

export default Component.extend({
  actions: {
    toggleSelected() {
      this.toggleProperty('selected');
      const onChangeHandler = this.get('onChange');
      if (onChangeHandler) {
        onChangeHandler(this.get('selected'));
      }
    }
  }
});
