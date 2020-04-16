import ApplicationSerializer from './application';
import { A } from '@ember/array';

export default ApplicationSerializer.extend({
  // The simplest HAL serialization
  serialize() {
    let response = ApplicationSerializer.prototype.serialize.apply(this, arguments);
    let baseUrl = window.location.host;

    response._embedded.consents = A(response._embedded.consents).map(item => {
      item._links = {
        "localization": {
          "href": `${baseUrl}/consent/v1/definitions/${item.definition.id}/localizations/en-US`,
          "hreflang": "en-US"
        },
        "self": {
          "href": `${baseUrl}/consent/v1/consents/${item.id}`
        },
        "definition": {
          "href": `${baseUrl}/consent/v1/definitions/${item.definition.id}`
        }
      }

      return item;
    });

    return response;
  }
});
