import ApplicationAdapter from './application';
import { get } from '@ember/object';

export default ApplicationAdapter.extend({
  _buildURL(modelName, id) {
    let url = [];
    let host = get(this, 'host');
    let prefix = this.urlPrefix();

    // localization URLs are sub-resources of the definition
    // e.g. /consent/v1/definitions/share-call-history/localizations/en-US
    // the serializer treats the last 3 components of the URL as the object id
    // therefore we just tack the id onto "definitions"
    url.push('definitions');
    if (id) { url.push(id); }
    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    if (!host && url && url.charAt(0) !== '/') {
      url = '/' + url;
    }

    return url;
  },
});
