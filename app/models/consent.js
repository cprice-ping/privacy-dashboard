import DS from 'ember-data';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

/*

{
    "_links": {
        "localization": {...},
        "definition": {...}
    },
    "id": "b9718e02-2cd7-4c90-8ace-e2e6b6a80e5a",
    "status": "accepted",
    "subject": "ad55a34a-763f-358f-93f9-da86f9ecd9e4",
    "subjectDN": "uid=user.0,ou=people,dc=example,dc=com",
    "actor": "ad55a34a-763f-358f-93f9-da86f9ecd9e4",
    "actorDN": "uid=user.0,ou=people,dc=example,dc=com",
    "audience": "postman",
    "definition": {
        "id": "share-call-history",
        "version": "1.0",
        "currentVersion": "1.0",
        "locale": "en-US"
    },
    "titleText": "Share your call history",
    "dataText": "Your call history including date and time, phone numbers, and durations",
    "purposeText": "Partners use this data to recommend alternate plans to better suit your usage",
    "data": {
        "minimum": 30
    },
    "consentContext": {
      "ip": "192.168.1.4",
      "browser": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36"
    },
    "createdDate": "2020-01-16T03:48:57.830Z",
    "updatedDate": "2020-01-16T03:48:57.830Z"
}

*/

export default DS.Model.extend({
  definition          : belongsTo('definition', {async: false, inverse: null}),
  localization        : belongsTo('localization', {async: false, inverse: null}),

  status              : attr('string'),
  subject             : attr('string'),
  actor               : attr('string'),
  audience            : attr('string'),
  titleText           : attr('string'),
  dataText            : attr('string'),
  purposeText         : attr('string'),
  createdDate         : attr('date'),
  updatedDate         : attr('date'),
  consentTime         : computed('createdDate', function() {
    return new Date(this.get('createdDate'));
  }),
  consentDetails      : attr(), // renamed this from "data"
  consentContext      : attr(),
  consentIpAddress    : reads('consentContext.ip'),
  consentBrowser      : reads('consentContext.browser'),
  savedDefinition     : attr(), // renamed this from "definition"
  savedDefinitionId   : reads('savedDefinition.id'),
  savedDefinitionVersion : reads('savedDefinition.version'),
  savedDefinitionLocale : reads('savedDefinition.locale'),
  currentDefinitionVersion : reads('savedDefinition.currentVersion'),

  init() {
    this.set('availableActions', [{
      name: "Read Data",
      action: "read_data",
      state: "read_data"
    },
    {
      name: "Delete Data",
      action: "delete_data",
      state: "delete_data"
    },
    {
      name: "Correct Data",
      action: "correct_data",
      state: "correct_data"
    },
    {
      name: "Export Data",
      action: "export_data",
      state: "export_data"
    }
    ]);

    this._super(...arguments);
  }

});
//
