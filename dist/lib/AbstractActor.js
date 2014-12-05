System.register("../../lib/AbstractActor", [], function() {
  "use strict";
  var __moduleName = "../../lib/AbstractActor";
  var EventEmitter = require("events").EventEmitter;
  var uid = require("shortid");
  var DomainEvent = require("./DomainEvent");
  var AbstractActor = function AbstractActor() {
    this.uncommittedEvents = [];
  };
  ($traceurRuntime.createClass)(AbstractActor, {
    get type() {
      return this.constructor.type;
    },
    get id() {
      throw new Error("no implements");
    },
    loadEvents: function(events) {
      var $__0 = this;
      events.forEach((function(event) {
        $__0.when(event);
      }));
      delete this.loadEvents;
    },
    when: function(event) {},
    apply: function() {
      for (var opts = [],
          $__2 = 0; $__2 < arguments.length; $__2++)
        opts[$__2] = arguments[$__2];
      opts.splice(1, 0, this);
      var event = new (Function.prototype.bind.apply(DomainEvent, $traceurRuntime.spread([null], opts)))();
      this.when(event);
      this.uncommittedEvents = this.uncommittedEvents || [];
      this.uncommittedEvents.push(event);
      this.emit("apply");
    },
    listen: function(eventName, handle, contextId) {
      this.emit('listen', {
        eventName: eventName,
        handle: handle,
        contextId: contextId
      });
    }
  }, {
    parse: function(json) {},
    toJSON: function(actor) {},
    get type() {
      throw new Error("please implements it");
    }
  }, EventEmitter);
  module.exports = AbstractActor;
  return {};
});
System.get("../../lib/AbstractActor" + '');
