import config from 'privacy-dashboard/config/environment';
// import Mirage from 'ember-cli-mirage';
export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  this.urlPrefix = config.APP.PD_HOST_PORT;

  this.get('/consent/v1/definitions');
  this.get('/consent/v1/consents');
  this.patch('/consent/v1/consents');

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.3.x/shorthands/
  */

  //
  // return {
  //   "_links": {"parent":
  //     {"href":"https://babb-consent-pd.ping-eng.com:8443/consent/v1/definitions/track_browsing_history"},
  //     "self":{
  //       "href":"https://babb-consent-pd.ping-eng.com:8443/consent/v1/definitions/track_browsing_history/localizations/en-US"}
  //   },
  //   "id":"en-US",
  //   "locale":"en-US",
  //   "version":"1.0",
  //   "dataText":"Your product browsing history including pages visited and time on page",
  //   "purposeText":"To learn your preferences and recommend products you may like"
  // };



}
