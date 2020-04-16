import HalSerializer from "ember-data-hal-9000/serializer";
import { get } from '@ember/object';
import { isArray } from '@ember/array';

export default HalSerializer.extend({
  normalize(primaryModelClass, payload /*, included */) {
    this.normalizeUsingDeclaredMapping(primaryModelClass, payload);

    return this._super(...arguments);
  },

  extractIdFromHref(type, href) {
    if (type === 'definition') {
      return href.split('/').pop()
    }
    else if (type === 'localization') {
      const parts = href.split('/');
      // localization URLs are sub-resources of the definition
      // e.g. /consent/v1/definitions/share-call-history/localizations/en-US
      // extract the last 3 parts as the resource id
      return parts.slice(parts.length - 3, parts.length).join('/');
    }
    else {
      return href
    }
  },

  extractRelationships(primaryModelClass, payload /*, included*/) {
    const transformedRelationships = {};
    const relationships = this._super(...arguments);

    // the HAL serializer extends the JSON-API serializer
    // by munging everything to look like JSON-API.
    // this monkey patches how it extracts related data
    // specifically fixing how it gets the resource id for each related type,
    // and fixing bugs in how it deals with _links[typename] being an array.
    Object.keys(relationships).forEach(relationshipName => {
      const relationship = relationships[relationshipName];
      const relationshipMeta = get(primaryModelClass, 'relationshipsByName').get(relationshipName);
      const relationshipTypeName = relationshipMeta.type || relationshipName;

      if (isArray(relationship.data)) { // embedded has many
        const data = relationship.data.map((rel) => {
            return {
              type: relationshipTypeName,
              id: this.extractIdFromHref(relationshipTypeName, rel['href'])
            }
          });
        transformedRelationships[relationshipName] = {data};
      }
      else if (payload._links && isArray(payload._links[relationshipName])) { // referenced has many
        const data = payload._links[relationshipName].map((link) => {
            return {
              type: relationshipTypeName,
              id: this.extractIdFromHref(relationshipTypeName, link.href)
            }
          });
        transformedRelationships[relationshipName] = {data};
      }
      else {
        const href = get(relationship, 'links.related');
        transformedRelationships[relationshipName] = {
          data: {
            type: relationshipTypeName,
            id: this.extractIdFromHref(relationshipTypeName, href)
          }
        }
      }
    });

    return transformedRelationships;
  },

  serializeIntoHash(hash, typeClass, snapshot, options) {
    const jsonapi = this.serialize(snapshot, options);
    for (let key in jsonapi.data.attributes) {
      hash[key] = jsonapi.data.attributes[key];
    }
  },

  // no-op these because they don't work right anyway
  serializeBelongsTo() {},
  serializeHasMany() {},
});
