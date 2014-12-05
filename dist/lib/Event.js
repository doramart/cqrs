System.register("../../lib/Event", [], function() {
  "use strict";
  var __moduleName = "../../lib/Event";
  var uid = require("shortid");
  var DomainEvent = function DomainEvent() {};
  ($traceurRuntime.createClass)(DomainEvent, {constrcutor: function(name, data, contextId) {
      this.id = uid();
      this.data = data;
      this.name = name;
      this.contextId = contextId;
      this.date = Date.now();
    }}, {});
  return {};
});
System.get("../../lib/Event" + '');
