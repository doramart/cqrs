System.register("../../lib/EventBus", [], function() {
  "use strict";
  var __moduleName = "../../lib/EventBus";
  var Emiter = require("events").EventEmitter,
      Event = require("./Event");
  var EventBus = function EventBus(eventstore, repos, actorListener) {
    var $__0 = this;
    this.repos = repos;
    this.actorListener = actorListener;
    this.es = eventstore;
    this.es.useEventPublisher((function(evt, cb) {
      var event = Event.reborn(evt);
      $__0.emit(evt.data.targetType + "." + evt.data.targetId + ":" + evt.name, event);
      $__0.emit(evt.data.targetType + "." + evt.data.targetId, event);
      $__0.emit(evt.data.targetType + ":" + evt.name, event);
      $__0.emit("." + evt.data.targetId + ":" + evt.name, event);
      $__0.emit(":" + evt.name, event);
      $__0.emit(evt.data.targetType, event);
      $__0.emit("*", event);
      if (evt.contextId) {
        $__0.emit(evt.data.targetType + "." + evt.data.targetId + ":" + evt.name + "&" + evt.contextId, event);
        $__0.emit(evt.data.targetType + "." + evt.data.targetId + "&" + evt.contextId, event);
        $__0.emit(evt.data.targetType + ":" + evt.name + "&" + evt.contextId, event);
        $__0.emit("." + evt.data.targetId + ":" + evt.name + "&" + evt.contextId, event);
        $__0.emit(":" + evt.name + "&" + evt.contextId, event);
        $__0.emit(evt.data.targetType + "&" + evt.contextId, event);
      }
    }));
    this.es.init();
  };
  ($traceurRuntime.createClass)(EventBus, {publish: function(actor) {
      var self = this;
      this.es.getFromSnapshot(actor.id, function(err, snap, stream) {
        var history = stream.events;
        if (history.length > 20) {
          self.es.createSnapshot({
            streamId: actor.id,
            data: actor.json,
            revision: stream.lastRevision
          }, function(err) {});
        }
        if (actor.uncommittedEvents.length) {
          stream.addEvents(actor.uncommittedEvents);
          stream.commit();
          actor.uncommittedEvents = [];
        }
      });
    }}, {}, Emiter);
  module.exports = EventBus;
  return {};
});
System.get("../../lib/EventBus" + '');
