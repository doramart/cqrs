System.register("../../lib/ActorListener", [], function() {
  "use strict";
  var __moduleName = "../../lib/ActorListener";
  var co = require("co"),
      Actor = require("./Actor"),
      _ = require("underscore");
  var ActorListener = Actor.extend({
    type: "ActorListener",
    init: function() {
      this._data.id = "ActorListenerId";
      this._data.repos = {};
    },
    listen: function(eventName, actor, handle, isOne) {
      this.apply("listen", {
        eventName: eventName,
        actorType: actor.type,
        actorId: actor.id,
        handle: handle,
        isOne: isOne
      });
    },
    listenOne: function() {
      arguments[3] = true;
      this.listen.apply(this, arguments);
    },
    pub: function(event) {
      var $__0 = this;
      var self = this;
      var list = self._data.repos[event.eventName] || [];
      list.forEach((function(listener) {
        $__0.myDomain.get(listener.actorType, listener.actorId, function(err, actor) {
          if (actor && actor[listener.handle])
            actor[listener.handle](event);
        });
      }));
      this.apply("emit", event.eventName);
    },
    when: function(event) {
      var repos = this._data.repos;
      if (event.name === "listen") {
        var eventName = event.data.eventName;
        var repo;
        repo = (repo = repos[eventName]) ? repos[eventName] : (repos[eventName] = []);
        repo.push(event.data);
      } else if (event.name === "emit") {
        var list = repos[event.data.data] || [];
        for (var i = 0,
            len = list.length; i < len; i++) {
          var listener = list[i];
          if (listener.isOne) {
            list[i] = null;
          }
        }
        repos[event.data] = _.compact(list);
      }
    }
  });
  module.exports = ActorListener;
  return {};
});
System.get("../../lib/ActorListener" + '');
