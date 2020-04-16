import ApplicationSerializer from './application';
import { get } from '@ember/object';

export default ApplicationSerializer.extend({
  // localization URLs are sub-resources of the definition
  // e.g. /consent/v1/definitions/share-call-history/localizations/en-US
  // this treats the last 3 components of the URL as the id.
  extractId(modelClass, resourceHash) {
    const parts = get(resourceHash, '_links.self.href').split('/');
    return parts.slice(parts.length - 3, parts.length).join('/');
  }
});
