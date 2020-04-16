(function(window, document, $) {
  var xhrId = 0;
  var xhrDeferreds = {};

  var App = {
    identity: null,
    initializeCallback: $.Deferred(),

    sendMessage: function(msg) {
      window.parent.postMessage(JSON.stringify(msg), '*');
    },

    saveConsentDetails: function(details) {
      this.sendMessage({
        action: 'set:details',
        data: details,
        identity: this.identity
      });
    },

    getJSON: function(url, queryParams) {
      var sendXhrId = ++xhrId;
      var deferred = xhrDeferreds[sendXhrId] = $.Deferred();
      this.sendMessage({
        action: 'xhr:json',
        data: {xhrId: sendXhrId, url: url, queryParams: queryParams},
        identity: this.identity
      });
      return deferred;
    },

    resize: function() {
      var element = document.getElementById('consent-container');
      if (element.parentElement) element = element.parentElement;
      var dimensions = element.getBoundingClientRect();
      this.sendMessage({
        action: 'set:dimensions',
        data: dimensions,
        identity: this.identity
      });
    },

    receiveMessage: function(e) {
      var message = JSON.parse(e.data);
      if (message.action == 'set:details') {
        var details = message.data;
        if (typeof(details) === 'undefined' || $.isPlainObject(details) || $.isArray(details)) {
          this.initializeCallback.resolve(details);
        }
      }
      else if (message.action == 'get:dimensions') {
        this.resize()
      }
      else if (message.action === 'xhr:json') {
        var params = message.data;
        var recvXhrId = params.xhrId;
        var data = params.data;
        var status = params.status;
        var error = params.error;
        var deferred = xhrDeferreds[recvXhrId];
        if (deferred) {
          delete xhrDeferreds[recvXhrId];
          if (status === 200) {
            deferred.resolve(data, status);
          }
          else {
            deferred.reject(error, status);
          }
        }
        else {
          console.warn("Unmatched XMLHttpRequest");
        }
      }
    },

    onInitialize: function(callback) {
      this.initializeCallback.then(callback);
    }
  };

  window.App = App;

  if (window.location.hash) {
    var parts = window.location.hash.substring(1).split('&');
    for (var i = 0; i < parts.length; i++) {
      var pair = parts[i].split('=');
      if (pair[0] === 'iframe') {
        App.identity = pair[1];
        break;
      }
    }
  }
  if (App.identity === null) {
    throw 'Error parsing identity from iframe URL';
  }

  window.addEventListener('message', function(e) {
    App.receiveMessage(e);
  });

  document.addEventListener('DOMContentLoaded', function() {
    App.sendMessage({
      action: 'ready',
      identity: App.identity,
    });
  });

  var oldHeight = null;
  window.addEventListener('resize', function(e) {
    var element = document.getElementById('consent-container');
    if (element.parentElement) element = element.parentElement;
    var newHeight = element.scrollHeight;
    var heightChange = newHeight - (oldHeight || 0);
    if (Math.abs(heightChange) > 5) {
      oldHeight = newHeight;
      App.resize();
    }
  });


})(window, document, window.$);
