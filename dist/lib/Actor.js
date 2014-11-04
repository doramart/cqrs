System.register("lib/Actor", [], function() {
  "use strict";
  var $__2;
  var __moduleName = "lib/Actor";
  var dataKye = Symbol("dataKey"),
      set = Symbol[$traceurRuntime.toProperty("set")],
      isLoadEvents = Symbol("isLoadEvents"),
      apply = Symbol("apply"),
      listen = Symbol("listen"),
      when = Symbol("when"),
      otherWhen = Symbol("otherWhen"),
      uid = require("shortid"),
      Event = require("./Event"),
      EventEmitter = require("events").EventEmitter,
      typeNames = [];
  var Actor = function Actor() {
    var data = arguments[0] !== (void 0) ? arguments[0] : {};
    this[$traceurRuntime.toProperty(dataKye)] = data;
    this[$traceurRuntime.toProperty(set)]("id", uid());
    this[$traceurRuntime.toProperty(set)]("alive", true);
    this.uncommittedEvents = [];
  };
  var $Actor = Actor;
  ($traceurRuntime.createClass)(Actor, ($__2 = {}, Object.defineProperty($__2, set, {
    value: function(k, v) {
      if (arguments.length === 1) {
        for (var n in k)
          if (!$traceurRuntime.isSymbolString(n)) {
            this[$traceurRuntime.toProperty(set)](n, k[$traceurRuntime.toProperty(n)]);
          }
      } else {
        this[$traceurRuntime.toProperty(dataKye)][$traceurRuntime.toProperty(k)] = v;
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "get", {
    value: function(k) {
      return this[$traceurRuntime.toProperty(dataKye)][$traceurRuntime.toProperty(k)];
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "id", {
    get: function() {
      return this.get("id");
    },
    configurable: true,
    enumerable: true
  }), Object.defineProperty($__2, "json", {
    get: function() {
      var data = JSON.parse(JSON.stringify(this[$traceurRuntime.toProperty(dataKye)]));
      data.id = this.get("id");
      data.alive = this.get("alive");
      return data;
    },
    configurable: true,
    enumerable: true
  }), Object.defineProperty($__2, "loadEvents", {
    value: function(events) {
      var $__0 = this;
      if (this[$traceurRuntime.toProperty(isLoadEvents)])
        return;
      var set = this.set.bind(this);
      events.forEach((function(event) {
        $__0[$traceurRuntime.toProperty(when)](event, set);
      }));
      this[$traceurRuntime.toProperty(isLoadEvents)] = true;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "loadSnap", {
    value: function(snap) {
      if (this[$traceurRuntime.toProperty(isLoadEvents)])
        return;
      this[$traceurRuntime.toProperty(set)](snap);
      this[$traceurRuntime.toProperty(isLoadEvents)] = true;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, listen, {
    value: function(eventName, handleName) {
      this.emit('listen', eventName, handleName);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, when, {
    value: function(event, set) {
      if (event.name === "remove") {
        set("alive", false);
      }
      if (this[$traceurRuntime.toProperty(otherWhen)])
        this[$traceurRuntime.toProperty(otherWhen)](event, set);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, apply, {
    value: function(name, data) {
      var caller = arguments[2] !== (void 0) ? arguments[2] : {};
      if (this.get("alive")) {
        var event = new Event(name, {
          callerId: caller.id,
          callerType: caller.typeName,
          targetId: this.get("id"),
          targetType: this.typeName,
          data: data
        });
        this[$traceurRuntime.toProperty(when)](event, this[$traceurRuntime.toProperty(set)].bind(this));
        this.uncommittedEvents.push(event);
        this.emit("apply", this);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "remove", {
    value: function() {
      this[$traceurRuntime.toProperty(apply)]("remove");
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "call", {
    value: function(commandName, data, caller) {
      var $__0 = this;
      this[$traceurRuntime.toProperty(commandName)](data, {
        apply: (function(eventName, data) {
          $__0[$traceurRuntime.toProperty(apply)](eventName, data, caller);
        }),
        listen: this[$traceurRuntime.toProperty(listen)].bind(this)
      });
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__2), {extend: function(options) {
      var typeName = options.typeName;
      if (typeNames.indexOf(typeName) !== -1)
        throw new Error("type name is exist.");
      var methods = options.methods;
      var Type = function Type() {
        $traceurRuntime.defaultSuperCall(this, $Type.prototype, arguments);
      };
      var $Type = Type;
      ($traceurRuntime.createClass)(Type, {}, {}, $Actor);
      Object.defineProperty(Type, "typeName", {get: function() {
          return typeName;
        }});
      Object.defineProperty(Type.prototype, "typeName", {get: function() {
          return typeName;
        }});
      Object.defineProperty(Type.prototype, otherWhen, {value: options.when});
      for (var k in methods)
        if (!$traceurRuntime.isSymbolString(k)) {
          Object.defineProperty(Type.prototype, k, {value: methods[$traceurRuntime.toProperty(k)]});
        }
      return Type;
    }}, EventEmitter);
  module.exports = Actor;
  return {};
});
System.get("lib/Actor" + '');
