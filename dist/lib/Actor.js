System.register("../../lib/Actor", [], function() {
  "use strict";
  var $__2;
  var __moduleName = "../../lib/Actor";
  var dataKye = Symbol("dataKey"),
      set = Symbol["set"],
      isLoadEvents = Symbol("isLoadEvents"),
      apply = Symbol("apply"),
      listen = Symbol("listen"),
      when = Symbol("when"),
      create = Symbol("create"),
      otherWhen = Symbol("otherWhen"),
      getDI = Symbol("getDI"),
      uid = require("shortid"),
      Event = require("./Event"),
      EventEmitter = require("events").EventEmitter;
  var Actor = function Actor() {
    var data = arguments[0] !== (void 0) ? arguments[0] : {};
    var isCreate = arguments[1] !== (void 0) ? arguments[1] : false;
    this[dataKye] = data;
    this[set]("id", uid());
    this[set]("alive", true);
    this.uncommittedEvents = [];
    if (isCreate) {
      this[create](this[dataKye]);
    }
  };
  var $Actor = Actor;
  ($traceurRuntime.createClass)(Actor, ($__2 = {}, Object.defineProperty($__2, set, {
    value: function(k, v) {
      if (arguments.length === 1) {
        for (var n in k) {
          this[set](n, k[n]);
        }
      } else {
        this[dataKye][k] = v;
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "get", {
    value: function(k) {
      return this[dataKye][k];
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
      var data = JSON.parse(JSON.stringify(this[dataKye]));
      data.id = this.get("id");
      data.alive = this.get("alive");
      return data;
    },
    configurable: true,
    enumerable: true
  }), Object.defineProperty($__2, "loadEvents", {
    value: function(events) {
      var $__0 = this;
      if (this[isLoadEvents])
        return;
      var set = this.set.bind(this);
      events.forEach((function(event) {
        $__0[when](event, set);
      }));
      this[isLoadEvents] = true;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "loadSnap", {
    value: function(snap) {
      if (this[isLoadEvents])
        return;
      this[set](snap);
      this[isLoadEvents] = true;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, when, {
    value: function(event, set) {
      if (event.name === "remove") {
        set("alive", false);
      } else if (event.name === "create") {
        this[dataKye] === event.data;
      }
      if (this._otherWhen)
        this._otherWhen(event, set);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, apply, {
    value: function(name, data) {
      var caller = arguments[2] !== (void 0) ? arguments[2] : {};
      var contextId = arguments[3] !== (void 0) ? arguments[3] : null;
      caller = caller || {};
      if (this.get("alive")) {
        var event = new Event(name, {
          callerId: caller.id,
          callerType: caller.typeName,
          targetId: this.get("id"),
          targetType: this.typeName,
          data: data
        }, contextId);
        this[when](event, this[set].bind(this));
        this.uncommittedEvents.push(event.json);
        this.emit("apply", this);
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, create, {
    value: function(data) {
      this.create(data, this[getDI]());
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "remove", {
    value: function() {
      this[apply]("remove");
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "create", {
    value: function(data, di) {
      di.apply("create", data);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, getDI, {
    value: function() {
      var data = arguments[0] !== (void 0) ? arguments[0] : {};
      var caller = arguments[1] !== (void 0) ? arguments[1] : {};
      var contextId = arguments[2] !== (void 0) ? arguments[2] : null;
      var $__0 = this;
      return {
        apply: (function(eventName, data, cxt) {
          $__0[apply](eventName, data, caller, cxt || contextId);
        }),
        listen: (function(eventName, handleName, cxt, onlyContext) {
          if (cxt === true) {
            onlyContext = cxt;
            cxt = contentId;
          }
          $__0.emit('listen', $__0, eventName, handleName, cxt || contextId, onlyContext);
        }),
        call: (function(command) {
          $__0.emit("call", command);
        })
      };
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "call", {
    value: function(commandName) {
      var data = arguments[1] !== (void 0) ? arguments[1] : {};
      var caller = arguments[2] !== (void 0) ? arguments[2] : {};
      var contextId = arguments[3] !== (void 0) ? arguments[3] : null;
      this[commandName](data, this[getDI](data, caller, contextId));
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__2), {extend: function(typeName) {
      var methods = arguments[1] !== (void 0) ? arguments[1] : {};
      var Type = function Type() {
        $traceurRuntime.defaultSuperCall(this, $Type.prototype, arguments);
      };
      var $Type = Type;
      ($traceurRuntime.createClass)(Type, {}, {}, $Actor);
      if (methods.create) {
        var createFun = methods.create;
        delete methods.create;
        Object.defineProperty(Type, constructor, {value: createFun});
      }
      Object.defineProperty(Type, "typeName", {get: function() {
          return typeName;
        }});
      Object.defineProperty(Type.prototype, "typeName", {get: function() {
          return typeName;
        }});
      for (var k in methods) {
        if (k === "when") {
          Object.defineProperty(Type.prototype, "_otherWhen", {value: methods[k]});
        } else {
          Object.defineProperty(Type.prototype, k, {value: methods[k]});
        }
      }
      return Type;
    }}, EventEmitter);
  module.exports = Actor;
  return {};
});
System.get("../../lib/Actor" + '');
