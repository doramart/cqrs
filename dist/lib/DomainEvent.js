System.register("../../lib/DomainEvent", [], function() {
  "use strict";
  var __moduleName = "../../lib/DomainEvent";
  var uid = require("shortid");
  var DomainEvent = function DomainEvent() {};
  ($traceurRuntime.createClass)(DomainEvent, {constrcutor: function(name, actor, data, contextId) {
      this.actorId = actor.id;
      this.actorType = actor.type;
      this.id = uid();
      this.data = data;
      this.name = name;
      this.contextId = contextId === true ? uid() : (typeof contextId === "string" ? contextId : null);
      this.date = Date.now();
      Object.freeze(this);
    }}, {});
  return {};
});
System.get("../../lib/DomainEvent" + '');
