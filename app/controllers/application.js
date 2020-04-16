import Controller from '@ember/controller';
import { computed } from '@ember/object';
import config from 'privacy-dashboard/config/environment';

export default Controller.extend({
  queryParams: 'LocalIdentityProfileID',
  LocalIdentityProfileID: null,
  backUrl: computed('LocalIdentityProfileID', function() {
    return `${config.APP.PF_HOST_PORT}/pf/idprofile.ping?LocalIdentityProfileID=${this.get('LocalIdentityProfileID')}`;
  })
});
