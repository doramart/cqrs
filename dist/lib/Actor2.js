System.register("../../lib/Actor2", [], function() {
  "use strict";
  var $__3;
  var __moduleName = "../../lib/Actor2";
  var dataKye = Symbol("dataKey"),
      isLoadEvents = Symbol("isLoadEvents"),
      apply = Symbol("apply"),
      listen = Symbol("listen"),
      readDataKye = Symbol("readDataKye"),
      Command = require("command"),
      when = Symbol("when"),
      create = Symbol("create"),
      getDI = Symbol("getDI"),
      uid = require("shortid"),
      EventEmitter = require("events").EventEmitter;
  var Actor = function Actor(data) {
    var isCreate = arguments[1] !== (void 0) ? arguments[1] : false;
    data = data || {};
    this[dataKye] = data;
    this[readDataKye] = {};
    this[dataKye].id = uid();
    this.uncommittedEvents = [];
    if (isCreate) {
      this[create](this[dataKye]);
    }
  };
  ($traceurRuntime.createClass)(Actor, ($__3 = {}, Object.defineProperty($__3, "id", {
    get: function() {
      return this[dataKye].id;
    },
    configurable: true,
    enumerable: true
  }), Object.defineProperty($__3, "data", {
    get: function() {
      return this[readDataKye];
    },
    configurable: true,
    enumerable: true
  }), Object.defineProperty($__3, "json", {
    get: function() {
      return this[readDataKye] = this.toJSON(this[dataKye]);
    },
    configurable: true,
    enumerable: true
  }), Object.defineProperty($__3, "refreshData", {
    value: function() {
      this.json;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, "toJSON", {
    value: function(data) {
      return JSON.parse(JSON.stringify(data));
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, "loadEvents", {
    value: function(events) {
      var $__0 = this;
      if (this[isLoadEvents])
        return;
      events.forEach((function(event) {
        $__0[when](event);
      }));
      this[isLoadEvents] = true;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, "loadSnap", {
    value: function(snap) {
      if (this[isLoadEvents])
        return;
      this[dataKye] = this.reborn(snap);
      this[isLoadEvents] = true;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, "reborn", {
    value: function(data) {
      return data;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, when, {
    value: function(event) {
      if (event.name === "create") {
        var data = this.reborn(event.data);
        for (var k in data) {
          this[dataKye][k] = data[k];
        }
      }
      if (this._otherWhen)
        this._otherWhen(event, this[dataKye]);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, apply, {
    value: function() {
      var $__0 = this;
      return Command("name", "data", "caller", "contextId", [, {}, {}], arguments, (function(opts) {
        var event = {
          name: opts.name,
          callerId: opts.caller.id,
          callerType: opts.caller.type,
          targetType: $__0.type,
          targetId: $__0.id,
          data: opts.data,
          contextId: opts.contextId
        };
        $__0[when](event);
        $__0.uncommittedEvents.push(event);
        $__0.emit("apply", $__0);
      }));
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, create, {
    value: function(data) {
      this.create(data, this[getDI]());
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, "remove", {
    value: function() {
      this[apply]("remove");
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, "create", {
    value: function(data, di) {
      di.apply("create", data);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, getDI, {
    value: function() {
      var data = arguments[0] !== (void 0) ? arguments[0] : {};
      var caller = arguments[1] !== (void 0) ? arguments[1] : {};
      var contextId = arguments[2] !== (void 0) ? arguments[2] : null;
      var $__0 = this,
          $__1 = arguments;
      return {
        apply: (function(eventName, data, cxt) {
          return $__0[apply](eventName, data, {}, cxt);
        }),
        listen: (function() {
          return Command("name", "handle", "contextId", "onlyContext", $__1, (function(opts) {
            $__0.emit('listen', opts);
          }));
        }),
        call: (function(command) {
          $__0.emit("call", command);
        }),
        create: (function() {
          var $__5;
          for (var opts = [],
              $__4 = 0; $__4 < arguments.length; $__4++)
            opts[$__4] = arguments[$__4];
          opts.unshift("create");
          ($__5 = $__0).emit.apply($__5, $traceurRuntime.spread(opts));
        })
      };
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__3, "call", {
    value: function() {
      var $__0 = this;
      return Command("commandName", "data", "caller", "contextId", [, {}, {}], arguments, (function(opts) {
        var commandName = opts.commandName,
            data = opts.data || {},
            caller = opts.caller || {},
            contextId = null;
        $__0[commandName](data, $__0[getDI](data, caller, contextId));
      }));
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__3), {}, EventEmitter);
  module.exports = Actor;
  return {};
});
System.get("../../lib/Actor2" + '');
