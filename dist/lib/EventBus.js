System.register("../../lib/EventBus", [], function() {
  "use strict";
  var __moduleName = "../../lib/EventBus";
  var Emiter = require("events").EventEmitter,
      Event = require("./DomainEvent");
  var EventBus = function EventBus(eventstore, repos, actorListener) {
    var $__0 = this;
    this.repos = repos;
    this.actorListener = actorListener;
    this.es = eventstore;
    this.es.useEventPublisher((function(evt, cb) {
      $__0.emit(evt.targetType + "." + evt.targetId + ":" + evt.name, evt);
      $__0.emit(evt.targetType + "." + evt.targetId, evt);
      $__0.emit(evt.targetType + ":" + evt.name, evt);
      $__0.emit("." + evt.targetId + ":" + evt.name, evt);
      $__0.emit(":" + evt.name, evt);
      $__0.emit(evt.targetType, evt);
      $__0.emit("*", evt);
      if (evt.contextId) {
        $__0.emit(evt.targetType + "." + evt.targetId + ":" + evt.name + "&" + evt.contextId, evt);
        $__0.emit(evt.targetType + "." + evt.targetId + "&" + evt.contextId, evt);
        $__0.emit(evt.targetType + ":" + evt.name + "&" + evt.contextId, evt);
        $__0.emit("." + evt.targetId + ":" + evt.name + "&" + evt.contextId, evt);
        $__0.emit(":" + evt.name + "&" + evt.contextId, evt);
        $__0.emit(evt.targetType + "&" + evt.contextId, evt);
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
