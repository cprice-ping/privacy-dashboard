import ApplicationSerializer from './application';
import { get } from '@ember/object';

export default ApplicationSerializer.extend({
  attrs: {
    subject             : {serialize: false},
    actor               : {serialize: false},
    createdDate         : {serialize: false},
    updatedDate         : {serialize: false},
    consentDetails      : 'data',
    savedDefinition     : {key: 'definition', serialize: false}
  },

  serializeIntoHash(hash, typeClass, snapshot, options) {
    const jsonapi = this.serialize(snapshot, options);
    for (let key in jsonapi.data.attributes) {
      hash[key] = jsonapi.data.attributes[key];
    }

    // serialize from the record's related definition and localization
    // into json attribute 'definition'
    const belongsToDefinition = snapshot.belongsTo('definition');
    const definition = belongsToDefinition ? belongsToDefinition.record : null;
    const belongsToLocalization = snapshot.belongsTo('localization');
    const localization = belongsToLocalization ? belongsToLocalization.record : null;
    if (definition && definition.get('isLoaded') && localization && localization.get('isLoaded')) {
      hash['definition'] = {
        id: get(belongsToDefinition, 'record.id'),
        locale: get(belongsToLocalization, 'record.locale'),
        version: get(belongsToLocalization, 'record.version'),
        currentVersion: get(belongsToLocalization, 'record.version'),
      }
    }
  }

});
