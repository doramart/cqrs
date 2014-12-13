System.register("../../lib/EventBus", [], function() {
  "use strict";
  var __moduleName = "../../lib/EventBus";
  var Emiter = require("events").EventEmitter,
      Event = require("./DomainEvent");
  var EventBus = function EventBus(eventstore) {
    var $__0 = this;
    this.es = eventstore;
    this.es.useEventPublisher((function(evt, cb) {
      $__0._publish(evt);
    }));
    this.es.init();
  };
  ($traceurRuntime.createClass)(EventBus, {
    _publish: function(evt) {
      this.emit(evt.targetType + "." + evt.targetId + ":" + evt.name, evt);
      this.emit(evt.targetType + "." + evt.targetId, evt);
      this.emit(evt.targetType + ":" + evt.name, evt);
      this.emit("." + evt.targetId + ":" + evt.name, evt);
      this.emit(":" + evt.name, evt);
      this.emit(evt.targetType, evt);
      this.emit("*", evt);
      if (evt.contextId) {
        this.emit(evt.targetType + "." + evt.targetId + ":" + evt.name + "&" + evt.contextId, evt);
        this.emit(evt.targetType + "." + evt.targetId + "&" + evt.contextId, evt);
        this.emit(evt.targetType + ":" + evt.name + "&" + evt.contextId, evt);
        this.emit("." + evt.targetId + ":" + evt.name + "&" + evt.contextId, evt);
        this.emit(":" + evt.name + "&" + evt.contextId, evt);
        this.emit(evt.targetType + "&" + evt.contextId, evt);
      }
    },
    publish: function(actor) {
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
    }
  }, {}, Emiter);
  module.exports = EventBus;
  return {};
});
System.get("../../lib/EventBus" + '');
