import DS from 'ember-data';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

/*

{
    "id": "en-US",
    "locale": "en-US",
    "version": "1.0",
    "titleText": "Share your call history",
    "dataText": "Your call history including date and time, phone numbers, and durations",
    "purposeText": "Partners use this data to recommend alternate plans to better suit your usage"
}

 */
export default DS.Model.extend({
  definition          : belongsTo('definition', {async: false}),

  locale              : attr('string'),
  version             : attr('string'),
  titleText           : attr('string'),
  dataText            : attr('string'),
  purposeText         : attr('string')
});
