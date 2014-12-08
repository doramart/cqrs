System.register("../../lib/AbstractActor", [], function() {
  "use strict";
  var __moduleName = "../../lib/AbstractActor";
  var EventEmitter = require("events").EventEmitter;
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
    apply: function(name, data, contextId) {
      var event = new DomainEvent(name, this, data, contextId);
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
