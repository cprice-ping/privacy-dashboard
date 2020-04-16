import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  // The simplest HAL serialization
  serialize(object, request) {
    let json = Serializer.prototype.serialize.apply(this, arguments);

    let response = {
      "_embedded": json,
      "_links": {
         "self": {
           "href": `//` + [window.location.host, request.url].join("/")
         }
       },
      "count": object.length,
      "size": object.length
    }
    return response;
  }
})
