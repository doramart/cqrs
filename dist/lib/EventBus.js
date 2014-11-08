System.register("lib/EventBus", [], function() {
  "use strict";
  var __moduleName = "lib/EventBus";
  var Emiter = require("events").EventEmitter,
      Event = require("./Event"),
      co = require("co");
  var EventBus = function EventBus(eventstore, repos) {
    var $__0 = this;
    this.repos = repos;
    this.es = eventstore;
    this.emitter = new Emiter();
    this.es.useEventPublisher((function(evt, cb) {
      var event = Event.reborn(evt);
      $__0.emitter.emit(evt.data.targetType + "." + evt.data.targetId + ":" + evt.name, event);
      $__0.emitter.emit(evt.data.targetType + ":" + evt.name, event);
      $__0.emitter.emit("." + evt.data.targetId + ":" + evt.name, event);
      $__0.emitter.emit(":" + evt.name, event);
      $__0.emitter.emit(evt.data.targetType, event);
      if (evt.contextId) {
        $__0.emitter.emit(evt.data.targetType + "." + evt.data.targetId + ":" + evt.name + "&" + evt.contextId, event);
        $__0.emitter.emit(evt.data.targetType + ":" + evt.name + "&" + evt.contextId, event);
        $__0.emitter.emit("." + evt.data.targetId + ":" + evt.name + "&" + evt.contextId, event);
        $__0.emitter.emit(":" + evt.name + "&" + evt.contextId, event);
        $__0.emitter.emit(evt.data.targetType + "&" + evt.contextId, event);
      }
    }));
    this.es.init();
  };
  ($traceurRuntime.createClass)(EventBus, {
    publish: function(actor) {
      this.es.getEventStream(actor.id, function(err, stream) {
        if (actor.uncommittedEvents.length) {
          stream.addEvents(actor.uncommittedEvents);
          stream.commit();
          actor.uncommittedEvents = [];
        }
      });
    },
    listen: function(actor, eventname, handleName, contextId, onlyContext) {
      var $__0 = this;
      var actorId = actor.id;
      var actorType = actor.typeName;
      this.emitter.on(eventname + (onlyContext && contextId ? "&" + contextId : ""), (function(event) {
        co($traceurRuntime.initGeneratorFunction(function $__2(self) {
          var act;
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  $ctx.state = 2;
                  return self.repos[$traceurRuntime.toProperty(actorType)].get(actorId);
                case 2:
                  act = $ctx.sent;
                  $ctx.state = 4;
                  break;
                case 4:
                  act.call(handleName, event, contextId);
                  $ctx.state = -2;
                  break;
                default:
                  return $ctx.end();
              }
          }, $__2, this);
        }))($__0);
      }));
    }
  }, {});
  module.exports = EventBus;
  return {};
});
System.get("lib/EventBus" + '');
