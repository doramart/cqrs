System.register("../../lib/Command", [], function() {
  "use strict";
  var __moduleName = "../../lib/Command";
  var _ = require("underscore");
  var EventEmitter = require("events").EventEmitter;
  var Command = function Command() {
    for (var optionkeys = [],
        $__2 = 0; $__2 < arguments.length; $__2++)
      optionkeys[$__2] = arguments[$__2];
    var $__0 = this;
    var opts = this.opts = {};
    optionkeys.forEach((function(k) {
      $__0[k] = (function(v) {
        opts[k] = v;
        return $__0;
      });
    }));
  };
  ($traceurRuntime.createClass)(Command, {exec: function() {
      this.emit("exec", this.opts);
    }}, {}, EventEmitter);
  module.exports = Command;
  return {};
});
System.get("../../lib/Command" + '');
