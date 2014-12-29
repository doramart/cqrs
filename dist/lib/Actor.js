System.register("../../lib/Actor", [], function() {
  "use strict";
  var __moduleName = "../../lib/Actor";
  var AbstractActor = require("./AbstractActor");
  var uid = require("shortid");
  var debug = require("debug")("Actor");
  var Actor = function Actor() {
    var data = arguments[0] !== (void 0) ? arguments[0] : {};
    $traceurRuntime.superCall(this, $Actor.prototype, "constructor", []);
    this._data = data;
    this._data.id = uid();
    this.on("apply", this.refreshData);
    this.refreshData();
  };
  var $Actor = Actor;
  ($traceurRuntime.createClass)(Actor, {
    remove: function() {
      this.apply("remove");
    },
    refreshData: function() {
      this.data = this.constructor.toJSON(this);
      Object.freeze(this.data);
    },
    get id() {
      return this._data.id;
    },
    loadEvents: function(events) {
      $traceurRuntime.superCall(this, $Actor.prototype, "loadEvents", [events]);
      this.refreshData();
    }
  }, {
    get type() {
      return this.name;
    },
    parse: function(json) {
      var actor = new this(json);
      actor._data.id = json.id;
      return actor;
    },
    toJSON: function(actor) {
      return JSON.parse(JSON.stringify(actor._data));
    },
    extend: function() {
      var methods = arguments[0] !== (void 0) ? arguments[0] : {};
      var whenFun = methods.when;
      var typeName = methods.type;
      var initFun = methods.init;
      var toJSONFun = methods.toJSON;
      var parseFun = methods.parse;
      var Type = function Type() {
        var data = arguments[0] !== (void 0) ? arguments[0] : {};
        data.alive = true;
        this._data = data;
        if (initFun) {
          initFun.call(this, data);
        }
        $traceurRuntime.superCall(this, $Type.prototype, "constructor", [this._data]);
        if (!this._data.id) {
          this._data.id = id;
        }
      };
      var $Type = Type;
      ($traceurRuntime.createClass)(Type, {when: function(event) {
          if (event.name === "remove") {
            this._data.alive = false;
          }
          if (whenFun)
            whenFun.call(this, event);
        }}, {
        get type() {
          return typeName;
        },
        toJSON: function(actor) {
          var json;
          if (toJSONFun) {
            json = toJSONFun.call(this, actor);
          } else {
            json = $traceurRuntime.superCall(this, $Type, "toJSON", [actor]);
          }
          json.alive = actor._data.alive;
          return json;
        },
        parse: function(json) {
          var actor;
          if (parseFun) {
            actor = parseFun.call(this, json);
          } else {
            actor = $traceurRuntime.superCall(this, $Type, "parse", [json]);
          }
          actor._data.alive = json.alive;
          actor.refreshData();
          return actor;
        }
      }, $Actor);
      var keys = Object.keys(methods);
      keys.forEach((function(k) {
        if (["when", "type", "init", "toJSON"].indexOf(k) === -1) {
          if (methods[k] === true) {
            Object.defineProperty(Type.prototype, k, {value: function(data) {
                this.apply(k, data);
              }});
          } else {
            Object.defineProperty(Type.prototype, k, {value: methods[k]});
          }
        }
      }));
      return Type;
    }
  }, AbstractActor);
  module.exports = Actor;
  return {};
});
System.get("../../lib/Actor" + '');
