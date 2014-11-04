System.register("lib/EventBus", [], function() {
  "use strict";
  var __moduleName = "lib/EventBus";
  var Emiter = require("events").EventEmitter,
      co = require("co"),
      emitter = Symbol("emitter"),
      inherits = require("util").inherits;
  var EventBus = function EventBus(es, repos) {
    this.listenerRepo = {};
    this.es = es;
    var self = this;
    this.repos = repos;
    es.useEventPublisher(function(evt) {
      co($traceurRuntime.initGeneratorFunction(function $__1() {
        function emit(self) {
          self.emit(evt.aggregateType + "." + evt.aggregateId + ":" + evt.name, evt);
          self.emit("." + evt.aggregateId + ":" + evt.name, evt);
          self.emit("." + evt.aggregateId, evt);
          self.emit(evt.aggregateType + ":" + evt.name, evt);
          self.emit(evt.aggregateType, evt);
          self.emit(":" + evt.name, evt);
        }
        var actor;
        return $traceurRuntime.createGeneratorInstance(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                $ctx.state = (evt.callerId) ? 1 : 7;
                break;
              case 1:
                $ctx.state = 2;
                return self.repos[$traceurRuntime.toProperty(evt.callerType)].get(evt.callerId);
              case 2:
                actor = $ctx.sent;
                $ctx.state = 4;
                break;
              case 4:
                if (actor) {
                  saga._emit(evt.aggregateType + "." + evt.aggregateId + ":" + evt.name, evt);
                  saga._emit("." + evt.aggregateId + ":" + evt.name, evt);
                  saga._emit("." + evt.aggregateId, evt);
                  saga._emit(evt.aggregateType + ":" + evt.name, evt);
                  saga._emit(evt.aggregateType, evt);
                  saga._emit(":" + evt.name, evt);
                }
                emit(self);
                $ctx.state = -2;
                break;
              case 7:
                emit(self);
                $ctx.state = -2;
                break;
              default:
                return $ctx.end();
            }
        }, $__1, this);
      }))();
    });
  };
  ($traceurRuntime.createClass)(EventBus, {
    publsh: function(actor) {
      this.es.getEventStream(actor.id, function(err, stream) {
        if (aggregation.uncommittedEvents.length) {
          stream.addEvents(aggregation.uncommittedEvents);
          stream.commit();
          actor.uncommittedEvents = [];
        }
      });
    },
    listen: function(eventname, actor, handleName) {
      if (!this.listenerRepo[$traceurRuntime.toProperty(eventname)]) {
        this.listenerRepo[$traceurRuntime.toProperty(eventname)] = [];
      }
    }
  }, {}, Emiter);
  module.exports = EventBus;
  return {};
});
System.get("lib/EventBus" + '');
